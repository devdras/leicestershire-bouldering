# Leicestershire Bouldering PWA Logbook

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) An unofficial Progressive Web App (PWA) designed as a digital companion and logbook for bouldering routes in Leicestershire, UK.

This app allows users to browse areas, sectors, and blocks, view route details, and track their climbing progress by ticking off completed routes. Data is sourced from the excellent free PDF guides available online.

**Visit the live app:** [[Link to deployed app](https://leicestershire-bouldering.vercel.app/)]

## Data Source Acknowledgment

**Important:** All climbing route information (names, grades, descriptions, topo locations) presented in this application has been transcribed from the publicly available PDF guides published on the official **[Leicestershire Bouldering website](https://www.leicestershirebouldering.co.uk/)**.

This application is an **unofficial** tool and is not affiliated with the creators of the original Leicestershire Bouldering guides. Please visit their website for the definitive source PDFs and consider supporting their work.

## Features

- **Browse:** Navigate Leicestershire bouldering areas, sectors, and blocks.
- **Route Details:** View route names, grades, descriptions, and topo images.
- **Tick Logging:** Mark routes as climbed with a simple click. Ticks are saved locally on your device using IndexedDB.
- **Progress Tracking:** See summaries of ticked routes vs. total routes for Areas, Sectors, and Blocks.
- **PWA Support:** Installable as a Progressive Web App on compatible devices (Desktop, Android, iOS) for an app-like experience and offline access (for Browse cached data and viewing local ticks).
- **Data Management:** Export your ticked routes data to a JSON file for backup or transfer, and import previously exported files to restore data.
- **Local Storage:** All tick data is stored exclusively on the user's device within the specific browser or installed PWA instance. Data does **not** automatically sync between devices.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Database:** IndexedDB (via `idb` library)
- **Icons:** Lucide React
- **PWA:** Vite PWA Plugin (using Workbox)
- **Linting:** ESLint / TypeScript ESLint

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (usually comes with Node.js) or yarn

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/devdras/leicestershire-bouldering-pwa.git](https://github.com/devdras/leicestershire-bouldering-pwa.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd leicestershire-bouldering-pwa
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or if you prefer yarn:
    # yarn install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application should now be running locally, typically at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the development server with hot module replacement.
- `npm run build`: Compiles TypeScript and builds the production-ready application in the `dist/` folder.
- `npm run lint`: Runs ESLint to check for code style issues and potential errors.
- `npm run preview`: Serves the production build locally for previewing.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/devdras/leicestershire-bouldering-pwa/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (Optional: Create a LICENSE file if you haven't).
