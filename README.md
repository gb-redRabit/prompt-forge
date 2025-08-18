# Prompt Forge

Prompt Forge is a Vue 3 application designed for creating, generating, and managing various types of prompts, including video, text, audio, and images. The application supports both Polish and English languages, allowing users to switch between them easily.

## Features

- **Multi-language Support**: Automatically detects the user's language or allows manual switching between Polish and English.
- **Prompt Creation**: Users can create prompts of different types through a user-friendly interface.
- **Prompt Browsing**: A dedicated page for browsing available prompts.
- **Responsive Design**: Built with Tailwind CSS and DaisyUI for a modern and responsive user experience.
- **Toast Notifications**: Provides feedback to users through toast notifications using vue3-toastify.

## Project Structure

The project is organized as follows:

```
prompt-forge
├── src
│   ├── main.js                # Entry point of the application
│   ├── App.vue                # Root component
│   ├── router
│   │   └── index.js           # Application routing
│   ├── store
│   │   └── index.js           # State management with Pinia
│   ├── i18n
│   │   ├── index.js           # Internationalization setup
│   │   ├── pl.json            # Polish translations
│   │   └── en.json            # English translations
│   ├── assets
│   │   ├── tailwind.css       # Tailwind CSS styles
│   │   └── vue.svg            # SVG asset
│   ├── components
│   │   ├── Navbar.vue         # Navigation bar component
│   │   ├── Footer.vue         # Footer component
│   │   ├── LanguageSwitcher.vue# Language switcher component
│   │   ├── PromptCard.vue      # Individual prompt card component
│   │   └── ToastContainer.vue  # Toast notifications component
│   ├── pages
│   │   ├── Home.vue           # Homepage
│   │   ├── Prompts.vue        # Prompts listing page
│   │   ├── CreatePrompt.vue   # Prompt creation page
│   │   ├── About.vue          # About page
│   │   └── NotFound.vue       # 404 page
├── public
│   └── vite.svg               # Public SVG asset
├── package.json               # Project metadata and dependencies
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

   ```
   git clone <repository-url>
   cd prompt-forge
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
