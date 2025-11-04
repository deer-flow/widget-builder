import { Editor, EditorProps } from "@monaco-editor/react";
import { JSXLanguage } from "../src";
import { exampleComponents } from "./component-types";
import { createRoot } from "react-dom/client";

const jsx = new JSXLanguage({ components: exampleComponents });

const defaultJSx = `
<Card title="Welcome to Monaco JSX Editor">
    <Button text="Click Me" variant="primary" onClick={() => alert('Button Clicked!')} />
</Card>
`;

const Demo = () => {
  return (
    <Editor
      defaultValue={defaultJSx}
      language="typescript"
      path="main.tsx"
      onMount={(editor, monaco) => jsx.setup(editor, monaco)}
    />
  );
};

createRoot(document.getElementById("root")!).render(<Demo />);
