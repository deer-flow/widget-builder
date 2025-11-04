import { Editor, EditorProps } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import * as Monaco from "monaco-editor";
import { JSXLanguage, JSXLanguageOptions } from "../jsx/JSXLanguage";

export type JSXEditorProps = Omit<EditorProps, "language"> & {
  jsxOptions?: JSXLanguageOptions;
};

export const JSXEditor = ({
  value,
  onChange,
  jsxOptions,
  onMount,
  ...props
}: JSXEditorProps) => {
  const jsxLanguageRef = useRef<JSXLanguage | null>(null);

  const handleEditorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    // 创建并设置JSX语言支持
    if (jsxOptions) {
      jsxLanguageRef.current = new JSXLanguage(jsxOptions);
      jsxLanguageRef.current.setup(editor, monaco);
    }

    // 调用用户提供的onMount回调
    onMount?.(editor, monaco);
  };

  return (
    <Editor
      value={value}
      onChange={onChange}
      language="javascript"
      onMount={handleEditorDidMount}
      {...props}
    />
  );
};
