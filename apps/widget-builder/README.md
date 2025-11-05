# Widget Builder

A modern React application for building and customizing widgets.

## Tech Stack

- ⚡ **Vite 5** - Fast build tool and dev server
- ⚛️ **React 18.3** - Modern React with hooks
- 🔷 **TypeScript 5.6** - Type safety and better DX
- 🎨 **TailwindCSS v4** - Next-generation utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful and accessible UI components
- 📝 **ESLint** - Code linting and formatting

## Getting Started

### Prerequisites

Make sure you have Node.js and pnpm installed.

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development

The development server will start on `http://localhost:3000`.

### Project Structure

```
src/
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

### Adding Components

To add new shadcn/ui components, you can use their CLI or manually add them to the `src/components/ui` directory.

### Styling

This project uses TailwindCSS v4 for styling with a custom design system based on CSS variables. The color palette and design tokens can be customized in the `src/index.css` file.

**TailwindCSS v4 Changes:**

- Uses `@import "tailwindcss"` instead of separate `@tailwind` directives
- Configuration is now in TypeScript (`tailwind.config.ts`)
- No longer requires PostCSS configuration
- Built-in Vite plugin for better performance

## License

MIT
