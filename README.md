# Leicestershire Bouldering App

A modern web application for browsing and tracking bouldering routes in Leicestershire, UK. Built with Laravel, Inertia.js, React, and TypeScript.

## Features

   ```bash
   git clone <repository-url>
   cd leicestershire-bouldering
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   
   The app uses SQLite by default. Create the database file:
   ```bash
   touch database/database.sqlite
   ```
   
   Or update `.env` to use a different database.

6. **Run migrations and seed data**
   ```bash
   php artisan migrate --seed
   ```
   
   This will:
   - Create all necessary database tables
   - Import bouldering data from the legacy PWA project

## Development

### Running the development server

You need to run both the Laravel backend and the Vite dev server:

**Terminal 1 - Laravel backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite dev server:**
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

### Alternative: Single command

If you have `composer run dev` configured, you can run:
```bash
composer run dev
```

This will start both servers concurrently.

## 🐳 Deployment with Docker

This project includes a `Dockerfile` optimized for production use (PHP 8.2 + Apache).

### 1. Build the Image

```bash
docker build -t leicestershire-bouldering .
```

### 2. Run the Container

You need to mount a volume for the SQLite database to persist data, and provide an `.env` file.

```bash
# Create a file for the database on your host
touch $(pwd)/database.sqlite

# Run the container
docker run -d \
  -p 80:80 \
  --name lb-app \
  -v $(pwd)/database.sqlite:/var/www/html/database/database.sqlite \
  -v $(pwd)/.env:/var/www/html/.env \
  leicestershire-bouldering
```

**Note:** Ensure your `.env` file has `DB_CONNECTION=sqlite` and `DB_DATABASE=/var/www/html/database/database.sqlite`.

### 3. Initial Setup (Inside Container)

After starting the container for the first time, run migrations:

```bash
docker exec -it lb-app php artisan migrate --seed --force
```

## 🚀 Production Data Management

This application uses a hybrid approach where static climbing data (Areas, Sectors, Crags, Climbs) is seeded from a JSON source of truth, while user data (Ticks) is stored in the database.

### Adding New Climbs/Areas in Production

Since the climbing data is seeded from `database/seeders/LegacyDataSeeder.php` (which reads from `storage/app/legacy_data.json`), adding new content requires a deployment:

1.  **Update Data Source**:
    *   Modify the source data (currently `legacy_data.json` or the original `index.ts` if you re-run the export script).
    *   Alternatively, create a new migration or seeder to insert specific new areas/climbs.

2.  **Deploy & Seed**:
    *   After deploying the new code/container, run the seeder to update the database.
    *   **Warning**: The current `LegacyDataSeeder` truncates tables! For production updates, you should create a **new** seeder (e.g., `AddNewAreaSeeder.php`) that only *inserts* new records without deleting existing ones to preserve IDs and relationships.

    **Running in Docker:**
    ```bash
    docker exec -it lb-app php artisan db:seed --class=AddNewAreaSeeder --force
    ```

### Database Strategy
*   **Static Data**: Treat `areas`, `sectors`, `crags`, `sections`, and `climbs` tables as "code-managed". Avoid manually editing these in the production database as changes might be overwritten by future seeders.
*   **User Data**: `users` and `ticks` tables are "state-managed" and persist indefinitely.

## 🛠 Development

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & NPM
- SQLite

### Running the development server

You need to run both the Laravel backend and the Vite dev server:

**Terminal 1 - Laravel backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite dev server:**
```bash
npm run dev
```

The application will be available at `http://localhost:8000`

### Alternative: Single command

If you have `composer run dev` configured, you can run:
```bash
composer run dev
```

This will start both servers concurrently.

## Project Structure

```
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   │   ├── AreaController.php
│   │   ├── SectorController.php
│   │   ├── CragController.php
│   │   ├── SearchController.php
│   │   └── TickController.php
│   └── Models/               # Eloquent models
│       ├── Area.php
│       ├── Sector.php
│       ├── Crag.php
│       ├── Section.php
│       ├── Climb.php
│       └── Tick.php
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
│       └── LegacyDataSeeder.php
├── resources/
│   ├── js/
│   │   ├── components/       # React components
│   │   ├── hooks/            # React hooks (useTicks)
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Inertia pages
│   │   │   ├── Areas.tsx
│   │   │   ├── Area.tsx
│   │   │   ├── Sector.tsx
│   │   │   ├── Crag.tsx
│   │   │   ├── About.tsx
│   │   │   └── DataExport.tsx
│   │   └── app.tsx           # Main React app
│   └── css/
│       └── app.css           # Tailwind CSS
└── routes/
    └── web.php               # Application routes
```

## Key Technologies

- **Backend**: Laravel 11
- **Frontend**: React 18 with TypeScript
- **Routing**: Inertia.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: SQLite (configurable)
- **Authentication**: Laravel Fortify

## Features in Detail

### Tick Tracking

- **Authenticated users**: Ticks are saved to the database
- **Guest users**: Ticks are saved to browser localStorage
- Seamless experience for both user types

### Search

- Real-time search across all content
- Categorized results (Areas, Sectors, Crags, Climbs)
- Keyboard shortcut support (⌘K)

### Statistics

- View tick progress on all list pages
- See how many climbs you've completed in each area/sector/crag
- Real-time updates as you tick climbs

## Data Source

All route information has been transcribed from the excellent PDF guides published on the [Leicestershire Bouldering website](https://www.leicestershirebouldering.co.uk/).

This app is not affiliated with the creators of the original guides.

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
