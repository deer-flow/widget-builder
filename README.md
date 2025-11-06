# Widget Builder

Widget Builder has been replicated from https://widgets.chatkit.studio/

It provides a Monaco-based JSX editor, a JSON state editor, a JSX→schema parser, and a lightweight preview renderer.

![Demo](./docs/image.png)

**Features**

- **Extensible widget components:** A curated library of reusable widget primitives (e.g., Button, Card, List, Input, Modal) designed for composition into complex UIs. An explicit extension API makes it straightforward to implement, register, and reuse custom widgets while preserving compatibility and predictable behavior.
- **Monaco-based JSX editor:** Interactive code editor with JSX language support provided by the `monaco-jsx-editor` package — includes code completion (IntelliSense), context-aware suggestions, snippets, and syntax/error highlighting for a smoother authoring experience.
- **JSON state editor:** Edit the widget's state in JSON format with real-time validation and error highlighting.
- **Lightweight renderer:** Render parsed JSX-schema to React elements for live preview and testing.

## Getting Started

### Widget Components

The demo app uses a set of pre-defined widget components located in the `[widget-components](./apps/widget-builder/src/components/widget-components/)` directory. You can create your own custom widgets by following the structure and conventions used in this package.

### Preset tailwind style variants

The widget components support preset Tailwind CSS style variants for quick styling. You can find the available variants in the `[variants](./apps/widget-builder/src/components/widget-components/variants)` directory.

### Development

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
