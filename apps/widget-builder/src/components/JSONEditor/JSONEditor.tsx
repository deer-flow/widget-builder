import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useEffect } from "react";

import type { editor } from "monaco-editor";

interface JSONEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string | number;
  className?: string;
  onValidate?: (isValid: boolean) => void;
}

export const JSONEditor = ({
  value,
  onChange,
  readOnly = false,
  className = "",
  onValidate,
}: JSONEditorProps) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure JSON language options
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: true,
    });

    // Format document on mount
    setTimeout(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    }, 100);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && onChange) {
      onChange(value);
    }
  };

  const handleEditorValidation = (markers: editor.IMarker[]) => {
    const hasErrors = markers.some(
      (marker) => marker.severity === 8 // MarkerSeverity.Error
    );
    onValidate?.(!hasErrors);
  };

  useEffect(() => {
    // Auto-format when value changes externally
    if (editorRef.current && value) {
      try {
        const formatted = JSON.stringify(JSON.parse(value), null, 2);
        if (formatted !== value) {
          editorRef.current.setValue(formatted);
        }
      } catch {
        // Invalid JSON, don't format
      }
    }
  }, [value]);

  return (
    <div className={className}>
      <Editor
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        onValidate={handleEditorValidation}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          bracketPairColorization: {
            enabled: true,
          },
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
};
