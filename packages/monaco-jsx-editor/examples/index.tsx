import { Editor } from "@monaco-editor/react";
import { JSONSchema4 } from "json-schema";
import { createRoot } from "react-dom/client";

import { JSXLanguage } from "../src";
import { exampleComponents } from "./component-types";


const dataSchema: JSONSchema4 = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["id", "name"],
    },
    isAdmin: { type: "boolean" },
  },
  required: ["user"],
};

const jsx = new JSXLanguage({ components: exampleComponents, dataSchema });

const defaultJSx = `
<Card title="Welcome to Monaco JSX Editor">
    <Text label={data.user.name} />
    <Button text="Click Me" variant="primary" />
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
