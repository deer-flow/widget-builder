import * as Monaco from "monaco-editor";
import {
  getWorker,
  MonacoJsxSyntaxHighlight,
} from "monaco-jsx-syntax-highlight";

import { ComponentDefinition, ComponentProp } from "../types";
import {
  generateComponentSnippets,
  generateComponentTypes,
} from "./ComponentTypes";
import { ReactTypes } from "./ReactTypes";
import {
  matchFullTags,
  matchLastHalfAttributes,
  matchTagNameAndAttributes,
} from "./regex";
import { htmlElements } from "./HTMLElements";

const MATCH_TAG_AND_ATTRIBUTES = /<([a-zA-Z_][\w-]*)(.*?)$/;

export type JSXLanguageOptions = {
  components?: ComponentDefinition[];
  allowedHTMLElements?: string[];
  disableAllHTMLElements?: boolean; // if true, no HTML elements are allowed
  setupCompilerOptions?: (
    monaco: typeof Monaco
  ) => Monaco.languages.typescript.CompilerOptions;
};

export class JSXLanguage {
  private readonly componentTypesLib: string;
  private _components: Record<string, ComponentDefinition> = {};

  private jsxHighlighter: MonacoJsxSyntaxHighlight | null = null;
  private completionDisposable: Monaco.IDisposable | null = null;
  private diagnosticsDisposable: Monaco.IDisposable | null = null;

  constructor(readonly options: JSXLanguageOptions) {
    // 生成组件类型声明
    this.componentTypesLib = generateComponentTypes(options.components || []);
    this._components = (options.components || []).reduce(
      (acc, def) => {
        acc[def.name] = def;
        return acc;
      },
      {} as Record<string, ComponentDefinition>
    );

    console.log("Component Types", this.componentTypesLib);
  }

  setup(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    const model = editor.getModel();

    // Force the model to use TypeScript for proper JSX support
    if (!model) {
      return;
    }

    // 设置TypeScript编译选项
    this.setupTypeScriptOptions(monaco);

    this.setupJsxHighlighting(editor, monaco);

    // 添加类型声明库
    this.addTypeDefinitions(monaco);

    // 设置自动完成
    // this.setupAutoCompletion(monaco);

    // 设置自定义诊断
    // this.setupCustomDiagnostics(model, monaco);

    // Store disposable for cleanup
    editor.onDidDispose(() => {
      if (this.completionDisposable) {
        this.completionDisposable.dispose();
      }
      this.jsxHighlighter = null;
    });
  }

  private setupJsxHighlighting(
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) {
    if (!this.jsxHighlighter) {
      this.jsxHighlighter = new MonacoJsxSyntaxHighlight(getWorker(), monaco);

      const { highlighter } = this.jsxHighlighter.highlighterBuilder(
        { editor },
        { jsxTagCycle: 6 }
      );

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

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      mergedOptions
    );
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
      mergedOptions
    );

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

    // Clear existing extra libs to avoid conflicts
    const tsDefaults = monaco.languages.typescript.typescriptDefaults;
    const jsDefaults = monaco.languages.typescript.javascriptDefaults;

    // 添加组件类型定义
    tsDefaults.addExtraLib(
      ReactTypes,
      "file:///node_modules/@types/react/jsx-runtime.d.ts"
    );

    tsDefaults.addExtraLib(
      this.componentTypesLib,
      "file:///widget-components.d.ts"
    );

    console.log("Generated component types:\n", this.componentTypesLib);

    jsDefaults.addExtraLib(
      ReactTypes,
      "file:///node_modules/@types/react/jsx-runtime.d.ts"
    );

    jsDefaults.addExtraLib(
      this.componentTypesLib,
      "file:///widget-components.d.ts"
    );
  }

  setupAutoCompletion(monaco: typeof Monaco) {
    // Dispose previous completion provider
    if (this.completionDisposable) {
      this.completionDisposable.dispose();
      this.completionDisposable = null;
    }

    // Register custom completion provider for typescript
    this.completionDisposable = monaco.languages.registerCompletionItemProvider(
      "typescript",
      {
        triggerCharacters: ["<", " ", '"', "'"],
        provideCompletionItems: (model, position, ctx) => {
          console.log("MonacoJSXEditor: Providing completion items");
          const suggestions: Monaco.languages.CompletionItem[] = [];

          // Get text around cursor to determine context
          const lineText = model.getLineContent(position.lineNumber);
          const textBeforeCursor = lineText.substring(0, position.column - 1);
          const textAfterCursor = lineText.substring(position.column - 1);

          // Analyze the context to determine what type of completion to provide
          const completionContext = this.analyzeCompletionContext(
            textBeforeCursor,
            textAfterCursor,
            ctx
          );

          console.log(completionContext);

          if (completionContext.type === "component") {
            this.addComponentCompletions(
              suggestions,
              model,
              position,
              completionContext,
              monaco
            );
          } else if (completionContext.type === "props") {
            this.addPropsCompletions(
              suggestions,
              model,
              position,
              completionContext,
              textBeforeCursor,
              textAfterCursor,
              monaco
            );
          }

          console.log(
            "MonacoJSXEditor: Total suggestions provided:",
            suggestions.length
          );
          return { suggestions };
        },
      }
    );
  }

  setupCustomDiagnostics(
    model: Monaco.editor.ITextModel,
    monaco: typeof Monaco
  ) {
    // 可以在这里添加自定义的语法检查和错误提示
    // 例如：检查组件属性是否正确、必需属性是否缺失等
    const diagnostics = this.createCustomDiagnostics(monaco);

    this.diagnosticsDisposable = model.onDidChangeContent(() => {
      diagnostics(model);
    });

    diagnostics(model);
  }

  /**
   * Helper methods for completion analysis
   */
  private analyzeCompletionContext(
    textBeforeCursor: string,
    textAfterCursor: string,
    ctx: Monaco.languages.CompletionContext
  ) {
    const { triggerKind, triggerCharacter } = ctx;

    console.log("Analyzing completion context:", {
      textBeforeCursor,
      textAfterCursor,
      triggerKind,
      triggerCharacter,
    });

    // Check if we're starting a new component tag
    if (triggerCharacter === "<") {
      return {
        type: "component" as const,
        triggerCharacter,
        partialInput: "",
      };
    }

    // Look for component context in the text before cursor
    const componentMatch = matchTagNameAndAttributes(textBeforeCursor);
    if (!componentMatch) {
      return { type: "none" as const };
    }

    const { componentName, attributesText } = componentMatch;

    // Check if we're inside quotes
    if (triggerCharacter === '"' || triggerCharacter === "'") {
      const attributeMatch = attributesText.match(/(\w+)=["']([^"']*)$/);
      if (attributeMatch) {
        return {
          type: "props" as const,
          componentName,
          triggerCharacter,
          attributeName: attributeMatch[1],
          partialValue: attributeMatch[2],
        };
      }
    }

    // Check if we're completing props
    if (
      triggerCharacter === " " ||
      triggerKind === Monaco.languages.CompletionTriggerKind.Invoke
    ) {
      if (!textBeforeCursor.includes("</")) {
        return {
          type: "props" as const,
          componentName,
          triggerCharacter,
          partialInput: "",
        };
      }
    }

    // Check if we're typing a component name after <
    if (
      textBeforeCursor.endsWith("<") ||
      (componentMatch && !attributesText.trim())
    ) {
      const partialComponent = textBeforeCursor.match(/<(\w*)$/);
      return {
        type: "component" as const,
        triggerCharacter,
        partialInput: partialComponent ? partialComponent[1] : "",
      };
    }

    return { type: "none" as const };
  }

  private addComponentCompletions(
    suggestions: Monaco.languages.CompletionItem[],
    model: Monaco.editor.ITextModel,
    position: Monaco.Position,
    completionContext: ReturnType<typeof this.analyzeCompletionContext>,
    monaco: typeof Monaco
  ) {
    const componentSnippets = generateComponentSnippets(
      this.options.components || []
    );

    componentSnippets.forEach((snippet) => {
      const range = this.calculateCompletionRange(
        model,
        position,
        completionContext
      );

      const item: Monaco.languages.CompletionItem = {
        label: snippet.name,
        kind: monaco.languages.CompletionItemKind.Class,
        insertText: snippet.insertText,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: snippet.description,
        detail: `Widget Component: ${snippet.name}`,
        sortText: `0${snippet.name}`,
        range: range,
      };

      suggestions.push(item);
    });
  }

  private addPropsCompletions(
    suggestions: Monaco.languages.CompletionItem[],
    model: Monaco.editor.ITextModel,
    position: Monaco.Position,
    completionContext: ReturnType<typeof this.analyzeCompletionContext>,
    textBeforeCursor: string,
    textAfterCursor: string,
    monaco: typeof Monaco
  ) {
    if (completionContext.type !== "props") return;

    const componentName = completionContext.componentName;
    if (componentName && this._components[componentName]) {
      const componentDef = this._components[componentName];
      const existingProps = this.parseExistingProps(
        textBeforeCursor,
        textAfterCursor
      );

      componentDef.props.forEach((prop) => {
        if (existingProps.includes(prop.name) || prop.name === "children")
          return;

        const range = this.calculateCompletionRange(
          model,
          position,
          completionContext
        );

        let insertText = "";
        let label = prop.name;

        if (
          completionContext.triggerCharacter === '"' ||
          completionContext.triggerCharacter === "'"
        ) {
          if (prop.type === "string" || prop.type.includes("'")) {
            const defaultValue = prop.defaultValue || "";
            insertText = `${defaultValue}`;
            label = `${prop.name}: ${defaultValue}`;
          } else {
            return;
          }
        } else {
          if (prop.type === "string") {
            const defaultValue = prop.defaultValue || "";
            insertText = `${prop.name}="$\{1:${defaultValue}}"`;
          } else if (prop.type === "boolean") {
            const defaultValue = prop.defaultValue || "";
            insertText = `${prop.name}={$\{1:${defaultValue}}}`;
          } else if (prop.type.includes("'")) {
            const options = prop.type
              .split("|")
              .map((opt) => opt.trim().replace(/'/g, ""));
            insertText = `${prop.name}="$\{1|${options.join(",")}|}"`;
          } else {
            insertText = `${prop.name}={$\{1:value}}`;
          }
        }

        const item: Monaco.languages.CompletionItem = {
          label,
          kind: monaco.languages.CompletionItemKind.Property,
          insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: prop.description,
          detail: `${prop.type}${prop.required ? " (required)" : ""}`,
          sortText: prop.required ? `0${prop.name}` : `1${prop.name}`,
          range: range,
        };

        suggestions.push(item);
      });
    }
  }

  private calculateCompletionRange(
    model: Monaco.editor.ITextModel,
    position: Monaco.Position,
    context: ReturnType<typeof this.analyzeCompletionContext>
  ): Monaco.IRange {
    const lineText = model.getLineContent(position.lineNumber);
    const textBeforeCursor = lineText.substring(0, position.column - 1);

    if (context.type === "component") {
      const componentMatch = textBeforeCursor.match(/<(\w*)$/);
      if (componentMatch) {
        const startColumn = position.column - componentMatch[1].length;
        return new Monaco.Range(
          position.lineNumber,
          startColumn,
          position.lineNumber,
          position.column
        );
      }
    } else if (context.type === "props") {
      const wordMatch = textBeforeCursor.match(/(\w*)$/);
      if (wordMatch) {
        const startColumn = position.column - wordMatch[1].length;
        return new Monaco.Range(
          position.lineNumber,
          startColumn,
          position.lineNumber,
          position.column
        );
      }
    }

    return new Monaco.Range(
      position.lineNumber,
      position.column,
      position.lineNumber,
      position.column
    );
  }

  private parseExistingProps(
    textBeforeCursor: string,
    textAfterCursor: string
  ): string[] {
    const props: string[] = [];
    const componentMatch = matchTagNameAndAttributes(textBeforeCursor);
    if (componentMatch) {
      const { attributes } = componentMatch;
      props.push(...attributes);
    }
    const lastHalfAttributes = matchLastHalfAttributes(textAfterCursor);
    return [...props, ...lastHalfAttributes];
  }

  /**
   * Create custom diagnostics function
   */
  private createCustomDiagnostics(monaco: typeof Monaco) {
    return (model: Monaco.editor.ITextModel) => {
      const allowedComponents = Object.keys(this._components);
      const text = model.getValue();

      // Skip validation for closing tags
      if (text.trim().startsWith("</")) {
        return;
      }

      const markers: Monaco.editor.IMarkerData[] = [];
      const tags = matchFullTags(text);

      for (const tag of tags) {
        const tagName = tag.tagName;

        // Skip closing tags
        if (tag.isClosing) {
          continue;
        }

        // Check if component exists
        const isValidComponent = this.isValidComponent(tagName);

        if (!isValidComponent) {
          const position = this.getTagPosition(model, text, tag.index);
          if (position) {
            markers.push({
              severity: monaco.MarkerSeverity.Error,
              message: `Unknown component or element: '${tagName}'. Available components: ${allowedComponents.join(", ")}`,
              startLineNumber: position.startLineNumber,
              startColumn: position.startColumn,
              endLineNumber: position.endLineNumber,
              endColumn: position.endColumn,
              code: "jsx-unknown-component",
            });
          }
          continue;
        }

        // Validate component props if it's a custom component
        if (this._components[tagName]) {
          const componentDef = this._components[tagName];
          this.validateComponentProps(
            model,
            text,
            tag,
            componentDef,
            markers,
            monaco
          );
        }
      }

      // Set markers on the model
      monaco.editor.setModelMarkers(model, "jsx-validator", markers);
    };
  }

  /**
   * Check if a component is valid (either custom component or allowed HTML element)
   */
  private isValidComponent(tagName: string): boolean {
    // Check if it's a custom component
    if (this._components[tagName]) {
      return true;
    }

    // Check if HTML elements are disabled
    if (this.options.disableAllHTMLElements) {
      return false;
    }

    // Check if it's in the allowed HTML elements list
    if (this.options.allowedHTMLElements) {
      return this.options.allowedHTMLElements.includes(tagName);
    }

    // Check if it's a standard HTML element
    return htmlElements.includes(tagName);
  }

  /**
   * Validate component props
   */
  private validateComponentProps(
    model: Monaco.editor.ITextModel,
    text: string,
    tag: {
      tagName: string;
      attributes: string[];
      index: number;
      isClosing: boolean;
    },
    componentDef: ComponentDefinition,
    markers: Monaco.editor.IMarkerData[],
    monaco: typeof Monaco
  ) {
    const { tagName, attributes } = tag;

    // Get detailed prop information
    const propDetails = this.parseDetailedProps(model, text, tag.index);
    const providedProps = new Set(attributes);

    // Check for required props
    for (const prop of componentDef.props) {
      if (prop.required && !providedProps.has(prop.name)) {
        const position = this.getTagPosition(model, text, tag.index);
        if (position) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: `Missing required prop '${prop.name}' for component '${tagName}'`,
            startLineNumber: position.startLineNumber,
            startColumn: position.startColumn,
            endLineNumber: position.endLineNumber,
            endColumn: position.endColumn,
            code: "jsx-missing-required-prop",
          });
        }
      }
    }

    // Check for invalid props
    const validPropNames = new Set(componentDef.props.map((p) => p.name));
    validPropNames.add("children"); // Always allow children prop
    validPropNames.add("key"); // Always allow React key prop
    validPropNames.add("ref"); // Always allow React ref prop

    for (const propName of attributes) {
      if (!validPropNames.has(propName)) {
        const propPosition = this.getPropPosition(
          model,
          text,
          tag.index,
          propName
        );
        if (propPosition) {
          const validProps = componentDef.props.map((p) => p.name).join(", ");
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            message: `Unknown prop '${propName}' for component '${tagName}'. Valid props: ${validProps}`,
            startLineNumber: propPosition.startLineNumber,
            startColumn: propPosition.startColumn,
            endLineNumber: propPosition.endLineNumber,
            endColumn: propPosition.endColumn,
            code: "jsx-unknown-prop",
          });
        }
      }
    }

    // Validate prop types for detailed props
    for (const propDetail of propDetails) {
      const propDef = componentDef.props.find(
        (p) => p.name === propDetail.name
      );
      if (propDef && propDetail.value !== undefined) {
        this.validatePropType(model, propDetail, propDef, markers, monaco);
      }
    }
  }

  /**
   * Parse detailed prop information including values
   */
  private parseDetailedProps(
    model: Monaco.editor.ITextModel,
    text: string,
    tagStartIndex: number
  ): Array<{ name: string; value?: string; position: Monaco.IRange }> {
    const props: Array<{
      name: string;
      value?: string;
      position: Monaco.IRange;
    }> = [];

    // Find the tag content
    const tagMatch = text.substring(tagStartIndex).match(/<[^>]+>/);
    if (!tagMatch) return props;

    const tagContent = tagMatch[0];
    const attributePattern =
      /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g;

    let match;
    while ((match = attributePattern.exec(tagContent)) !== null) {
      const propName = match[1];
      const propValue = match[2] || match[3] || match[4]; // string, string, or JSX expression

      const absoluteStart = tagStartIndex + match.index;
      const absoluteEnd = absoluteStart + match[0].length;

      const startPos = model.getPositionAt(absoluteStart);
      const endPos = model.getPositionAt(absoluteEnd);

      props.push({
        name: propName,
        value: propValue,
        position: new Monaco.Range(
          startPos.lineNumber,
          startPos.column,
          endPos.lineNumber,
          endPos.column
        ),
      });
    }

    return props;
  }

  /**
   * Validate prop type
   */
  private validatePropType(
    model: Monaco.editor.ITextModel,
    propDetail: { name: string; value?: string; position: Monaco.IRange },
    propDef: ComponentProp,
    markers: Monaco.editor.IMarkerData[],
    monaco: typeof Monaco
  ) {
    const { name, value, position } = propDetail;

    if (!value) return; // Skip validation for props without values (boolean props)

    // Basic type validation
    if (propDef.type === "string") {
      // String props should be quoted or in JSX expressions
      // This is mostly handled by TypeScript, but we can add custom validation
    } else if (propDef.type === "boolean") {
      if (value && !["true", "false"].includes(value.trim())) {
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: `Prop '${name}' expects a boolean value (true/false)`,
          startLineNumber: position.startLineNumber,
          startColumn: position.startColumn,
          endLineNumber: position.endLineNumber,
          endColumn: position.endColumn,
          code: "jsx-invalid-prop-type",
        });
      }
    } else if (propDef.type.includes("|") && propDef.type.includes("'")) {
      // Enum/union type with string literals
      const enumValues = propDef.type
        .split("|")
        .map((v) => v.trim().replace(/'/g, ""))
        .filter((v) => v.length > 0);

      const cleanValue = value.replace(/['"]/g, ""); // Remove quotes
      if (!enumValues.includes(cleanValue)) {
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: `Prop '${name}' must be one of: ${enumValues.join(", ")}. Received: '${cleanValue}'`,
          startLineNumber: position.startLineNumber,
          startColumn: position.startColumn,
          endLineNumber: position.endLineNumber,
          endColumn: position.endColumn,
          code: "jsx-invalid-enum-value",
        });
      }
    }
  }

  /**
   * Get position of a tag in the model
   */
  private getTagPosition(
    model: Monaco.editor.ITextModel,
    text: string,
    tagIndex: number
  ): Monaco.IRange | null {
    try {
      const tagMatch = text.substring(tagIndex).match(/<[^>]+>/);
      if (!tagMatch) return null;

      const startPos = model.getPositionAt(tagIndex);
      const endPos = model.getPositionAt(tagIndex + tagMatch[0].length);

      return new Monaco.Range(
        startPos.lineNumber,
        startPos.column,
        endPos.lineNumber,
        endPos.column
      );
    } catch {
      return null;
    }
  }

  /**
   * Get position of a specific prop in the model
   */
  private getPropPosition(
    model: Monaco.editor.ITextModel,
    text: string,
    tagIndex: number,
    propName: string
  ): Monaco.IRange | null {
    try {
      const tagMatch = text.substring(tagIndex).match(/<[^>]+>/);
      if (!tagMatch) return null;

      const tagContent = tagMatch[0];
      const propPattern = new RegExp(
        `\\b(${propName})(?:=(?:"[^"]*"|'[^']*'|\\{[^}]*\\}))?`,
        "g"
      );
      const propMatch = propPattern.exec(tagContent);

      if (!propMatch) return null;

      const absoluteStart = tagIndex + propMatch.index;
      const absoluteEnd = absoluteStart + propMatch[0].length;

      const startPos = model.getPositionAt(absoluteStart);
      const endPos = model.getPositionAt(absoluteEnd);

      return new Monaco.Range(
        startPos.lineNumber,
        startPos.column,
        endPos.lineNumber,
        endPos.column
      );
    } catch {
      return null;
    }
  }
}
