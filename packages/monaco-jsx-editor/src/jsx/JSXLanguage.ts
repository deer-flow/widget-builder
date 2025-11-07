import { JSONSchema4 } from "json-schema";
import * as Monaco from "monaco-editor";
import { getWorker, MonacoJsxSyntaxHighlight } from "monaco-jsx-syntax-highlight";

import { ComponentDefinition } from "../types";
import { generateComponentTypes } from "./ComponentTypes";
import { generateDataTypes } from "./DataTypes";
import { ReactTypes } from "./ReactTypes";

export type JSXLanguageOptions = {
  components?: ComponentDefinition[];
  dataSchema?: JSONSchema4;
  allowedHTMLElements?: string[];
  disableAllHTMLElements?: boolean; // if true, no HTML elements are allowed
  setupCompilerOptions?: (monaco: typeof Monaco) => Monaco.languages.typescript.CompilerOptions;
};

export class JSXLanguage {
  private readonly componentTypesLib: string;

  private jsxHighlighter: MonacoJsxSyntaxHighlight | null = null;
  private completionDisposable: Monaco.IDisposable | null = null;
  private dataTypesDisposable: Monaco.IDisposable | null = null;
  private jsxCompletionDisposable: Monaco.IDisposable | null = null;
  private _dataSchema: JSONSchema4 | null = null;
  private monaco: typeof Monaco | null = null;

  constructor(readonly options: JSXLanguageOptions) {
    // Generate component type declarations
    this.componentTypesLib = generateComponentTypes(options.components || []);
    console.log("JSXLanguage: Generated component types", this.componentTypesLib);
    this._dataSchema = options.dataSchema ?? null;
  }

  setup(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    this.monaco = monaco;

    const model = editor.getModel();

    // Force the model to use TypeScript for proper JSX support
    if (!model) {
      return;
    }

    // Set TypeScript compiler options
    this.setupTypeScriptOptions(monaco);

    this.setupJsxHighlighting(editor, monaco);

    // Add type declaration libraries
    this.addTypeDefinitions(monaco);

    // Add custom JSX completion provider
    this.setupJsxCompletionProvider(monaco);

    // Store disposable for cleanup
    editor.onDidDispose(() => {
      if (this.completionDisposable) {
        this.completionDisposable.dispose();
      }
      if (this.dataTypesDisposable) {
        this.dataTypesDisposable.dispose();
      }
      // if (this.jsxCompletionDisposable) {
      //   this.jsxCompletionDisposable.dispose();
      // }

      this.jsxHighlighter = null;
    });
  }

  updateDataTypes(schema: JSONSchema4) {
    this._dataSchema = schema;
    if (!this.monaco) {
      return;
    }
    const tsDefaults = this.monaco.languages.typescript.typescriptDefaults;
    const dataTypesUri = "file:///data-types.d.ts";

    try {
      // Remove old data types if exists
      if (this.dataTypesDisposable) {
        this.dataTypesDisposable.dispose();
      }

      const typeDefinitions = generateDataTypes(schema);
      // Add the new type definitions to both TS and JS defaults
      this.dataTypesDisposable = tsDefaults.addExtraLib(typeDefinitions, dataTypesUri);

      console.log("JSXLanguage: Updated data schema types", typeDefinitions);
    } catch (error) {
      console.error("JSXLanguage: Error updating data schema types:", error);
    }
  }

  private setupJsxCompletionProvider(monaco: typeof Monaco) {
    // Register completion item provider for JSX attributes
    this.jsxCompletionDisposable = monaco.languages.registerCompletionItemProvider("typescript", {
      triggerCharacters: ['"', "'"],
      provideCompletionItems: (model, position) => {
        // Get the text before the cursor
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // Check if we're inside a JSX attribute value
        const jsxAttributeMatch = textUntilPosition.match(/(\w+)=["']([^"']*)$/);
        if (!jsxAttributeMatch) {
          return { suggestions: [] };
        }

        const [, attributeName, currentValue] = jsxAttributeMatch;

        // Get component context - find the component tag before this attribute
        const componentMatch = textUntilPosition.match(/<(\w+)[^>]*$/);
        if (!componentMatch) {
          return { suggestions: [] };
        }

        const componentName = componentMatch[1];

        // Find the component definition
        const component = this.options.components?.find((c) => c.name === componentName);
        if (!component) {
          return { suggestions: [] };
        }

        // Find the property definition
        const prop = component.props.find((p) => p.name === attributeName);
        if (!prop) {
          return { suggestions: [] };
        }

        // Parse union types from the property type
        const suggestions = this.createCompletionSuggestions(prop.type, currentValue, position);

        return { suggestions };
      },
    });
  }

  private createCompletionSuggestions(
    propType: string,
    currentValue: string,
    position: Monaco.Position
  ): Monaco.languages.CompletionItem[] {
    const suggestions: Monaco.languages.CompletionItem[] = [];

    // Extract string literal types from union types
    const unionTypeRegex = /"([^"]+)"|'([^']+)'/g;
    let match;
    let i = 0;
    while ((match = unionTypeRegex.exec(propType)) !== null) {
      const value = match[1] || match[2];
      if (value && value.toLowerCase().includes(currentValue.toLowerCase())) {
        suggestions.push({
          label: value,
          sortText: `0_${String(i).padStart(3, "0")}_${value}`, // Ensure string literals appear first
          kind: this.monaco!.languages.CompletionItemKind.Value,
          insertText: value,
          detail: `String literal value`,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - currentValue.length,
            endColumn: position.column,
          },
        });
        i++;
      }
    }

    // Handle special cases like template literals for percentages
    if (propType.includes("`${number}%`")) {
      const percentageSuggestions = ["25%", "50%", "75%", "100%"];
      for (const percentage of percentageSuggestions) {
        if (percentage.toLowerCase().includes(currentValue.toLowerCase())) {
          suggestions.push({
            label: percentage,
            sortText: `1_${percentage.padStart(4, "0")}`,
            kind: this.monaco!.languages.CompletionItemKind.Value,
            insertText: percentage,
            detail: `Percentage value`,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column - currentValue.length,
              endColumn: position.column,
            },
          });
        }
      }
    }

    return suggestions;
  }

  private setupJsxHighlighting(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    if (!this.jsxHighlighter) {
      this.jsxHighlighter = new MonacoJsxSyntaxHighlight(getWorker(), monaco);

      const { highlighter } = this.jsxHighlighter.highlighterBuilder({ editor }, { jsxTagCycle: 6 });

      console.log("MonacoJSXEditor: Initializing JSX syntax highlighter");
      highlighter();
    }
  }

  private setupTypeScriptOptions(monaco: typeof Monaco) {
    const defaultOptions: Monaco.languages.typescript.CompilerOptions = {
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      jsxImportSource: "react",
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      skipLibCheck: false,
      strict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      lib: ["ES2020", "DOM"],
      noImplicitAny: true,
      strictNullChecks: true,
    };

    const customOptions = this.options.setupCompilerOptions?.(monaco) || {};
    const mergedOptions = { ...defaultOptions, ...customOptions };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(mergedOptions);
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(mergedOptions);

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [],
    });

    // Enable full type checking for better IntelliSense
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  }

  private addTypeDefinitions(monaco: typeof Monaco) {
    console.log("Adding type definitions to Monaco...");

    const tsDefaults = monaco.languages.typescript.typescriptDefaults;
    const jsDefaults = monaco.languages.typescript.javascriptDefaults;

    // Add React type definitions
    tsDefaults.addExtraLib(ReactTypes, "file:///node_modules/@types/react/jsx-runtime.d.ts");
    jsDefaults.addExtraLib(ReactTypes, "file:///node_modules/@types/react/jsx-runtime.d.ts");

    // Add component type definitions
    tsDefaults.addExtraLib(this.componentTypesLib, "file:///widget-components.d.ts");
    jsDefaults.addExtraLib(this.componentTypesLib, "file:///widget-components.d.ts");

    // Add data type definitions (if present)
    if (this._dataSchema) {
      const dataTypesContent = generateDataTypes(this._dataSchema);
      this.dataTypesDisposable = tsDefaults.addExtraLib(dataTypesContent, "file:///data-types.d.ts");
    }
  }
}
