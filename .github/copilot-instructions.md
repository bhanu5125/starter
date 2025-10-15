# Copilot Instructions for Tailux React Tailwind Admin Template

## Project Overview
This is a Vite-based React admin dashboard template using Tailwind CSS. The codebase is modular, with clear separation of concerns for layouts, pages, components, hooks, configs, and assets.

## Architecture & Key Directories
- `src/App.jsx`, `src/main.jsx`: Entry points for the React app.
- `src/app/`: Contains contexts, layouts, navigation, pages, and router logic. 
- `src/components/`: UI and template components, organized by feature.
- `src/assets/`: SVGs, images, and icons used throughout the UI.
- `src/configs/`: App configuration files (auth, breakpoints, theme).
- `src/constants/`: Centralized constants for app logic and UI.
- `src/hooks/`: Custom React hooks for state, effects, and UI behaviors.
- `src/middleware/`: Route guards for authentication and access control.
- `src/styles/`: CSS files, including Tailwind and custom styles.
- `public/`: Static assets for Vite, including images and SVGs.

## Developer Workflows
- **Start Dev Server:** `yarn dev` (or `npm run dev`)
- **Build for Production:** `yarn build` (or `npm run build`)
- **Preview Production Build:** `yarn preview`
- **Lint:** Uses ESLint config in `eslint.config.js`
- **Format:** Uses Prettier config in `prettier.config.js`
- **Tailwind:** Configured via `tailwind.config.js` and custom plugins in `tailwind_plugins/`

## Patterns & Conventions
- **Component Organization:** Shared UI components in `src/components/shared/`, template-specific in `src/components/template/`, and atomic UI elements in `src/components/ui/`.
- **Custom Hooks:** All hooks are in `src/hooks/` and follow the `useX` naming convention.
- **Route Guards:** Middleware components in `src/middleware/` wrap routes for access control (see `AdminGuard.jsx`, `AuthGuard.jsx`).
- **Constants:** Use values from `src/constants/` for enums, colors, and app-wide settings.
- **Config Files:** Centralized configs in `src/configs/` for easy updates.
- **Assets:** Use SVGs and images from `src/assets/` and `public/images/`.

## Integration Points
- **Axios:** API calls are abstracted in `src/utils/axios.js`.
- **i18n:** Internationalization setup in `src/i18n/`.
- **React Router:** Navigation logic in `src/app/navigation/` and `src/app/router/`.
- **Tailwind Plugins:** Custom theming and utilities in `tailwind_plugins/`.

## Examples
- To add a new page: Create a component in `src/app/pages/` and register it in the router.
- To add a new route guard: Implement in `src/middleware/` and wrap the route in the router config.
- To add a new hook: Place in `src/hooks/` and follow the naming pattern `useX.js`.

## External Dependencies
- React, React Router, Tailwind CSS, Axios, Headless UI, Vite

## Tips for AI Agents
- Prefer using existing hooks and components before creating new ones.
- Follow the directory structure for maintainability.
- Reference constants and configs for app-wide values.
- Use route guards for any protected routes.
- Keep styles in `src/styles/` and use Tailwind utility classes.

---
For questions about unclear patterns or missing documentation, ask the user for clarification or examples.
