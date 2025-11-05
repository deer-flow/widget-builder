import { Editor, EditorProps } from "@monaco-editor/react";
import * as Monaco from "monaco-editor";

import { JSXLanguageOptions } from "../jsx";
import { useJSXLanguage } from "./useJSXLanguage";
import { useEffect } from "react";

export type JSXEditorProps = Omit<EditorProps, "language" | "onMount"> &
  JSXLanguageOptions;

export const JSXEditor = ({ value, onChange, ...props }: JSXEditorProps) => {
  const jsxLanguageRef = useJSXLanguage(props);

  const handleEditorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    jsxLanguageRef.setup(editor, monaco);
  };

  return (
    <Editor
      value={value}
      onChange={onChange}
      language="typescript"
      path="main.tsx"
      onMount={handleEditorDidMount}
      {...props}
    />
  );
};
