# Widget Builder

Widget Builder has been replicated from https://widgets.chatkit.studio/

It provides a Monaco-based JSX editor, a JSON state editor, a JSX→schema parser, and a lightweight preview renderer.

**Features**

- **Monaco-based JSX editor:** Interactive code editor with JSX language support provided by the local `packages/monaco-jsx-editor`.
- **JSX → Schema parsing:** Convert authored JSX templates into a JSON.
- **Widget data model & schema inference:** Widgets are defined with a template, ui/data schema, and optional states.
- **Lightweight renderer:** Render parsed JSX-schema to React elements for live preview and testing.
- **Safe expression evaluation:** Templates can include expressions evaluated at render-time using the repository's expression utilities.

**Development**

- **Install dependencies (from repository root):**

  ```bash
  pnpm install
  ```

- **Run the widget-builder app (development):**

  Start the app using the workspace filter (runs the Vite dev server for `apps/widget-builder`):

  ```bash
  pnpm --filter @widget-builder/app dev
  ```

## License

MIT License.
