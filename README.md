# RoadReady - Car Rental Platform
## Built with React + TypeScript + Vite + Shadcn/UI + Supabase

RoadReady is an innovative, user-centric car rental platform designed to revolutionize the way people rent vehicles by combining cutting-edge technology with seamless user experience.
This Project is part of My Portfolio Porject for ALX SE Program C#22

## Project setup

The first thing you'll need to do is install NPM dependencies. and then run in your local machine pretty easy!

```sh
npm install && npm run dev
```

## Website Preview

![Homepage](screenshots/1.png)
![Features](screenshots/2.png)
![CarsPage](screenshots/3.png)
![AdminDashboard](screenshots/admin1.png)

## Live Demo
🔗 [DEMO](https://road-ready-nu.vercel.app/)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
