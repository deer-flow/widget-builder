import * as Monaco from "monaco-editor";
import { getWorker, MonacoJsxSyntaxHighlight } from "monaco-jsx-syntax-highlight";
import { JSONSchema4 } from "json-schema";

import { ComponentDefinition } from "../types";
import { generateComponentTypes } from "./ComponentTypes";
import { ReactTypes } from "./ReactTypes";
import { generateDataTypes } from "./DataTypes";

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
  private _dataSchema: JSONSchema4 | null = null;
  private monaco: typeof Monaco | null = null;

  constructor(readonly options: JSXLanguageOptions) {
    // 生成组件类型声明
    this.componentTypesLib = generateComponentTypes(options.components || []);
    this._dataSchema = options.dataSchema ?? null;
  }

  setup(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    this.monaco = monaco;

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

    // Store disposable for cleanup
    editor.onDidDispose(() => {
      if (this.completionDisposable) {
        this.completionDisposable.dispose();
      }
      if (this.dataTypesDisposable) {
        this.dataTypesDisposable.dispose();
      }

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

    // 添加 React 类型定义
    tsDefaults.addExtraLib(ReactTypes, "file:///node_modules/@types/react/jsx-runtime.d.ts");
    jsDefaults.addExtraLib(ReactTypes, "file:///node_modules/@types/react/jsx-runtime.d.ts");

    // 添加组件类型定义
    tsDefaults.addExtraLib(this.componentTypesLib, "file:///widget-components.d.ts");
    jsDefaults.addExtraLib(this.componentTypesLib, "file:///widget-components.d.ts");

    // 添加 data 类型定义（如果存在）
    if (this._dataSchema) {
      const dataTypesContent = generateDataTypes(this._dataSchema);
      this.dataTypesDisposable = tsDefaults.addExtraLib(dataTypesContent, "file:///data-types.d.ts");
    }
  }
}
