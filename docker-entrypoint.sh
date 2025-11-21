#!/bin/sh
set -e

# Check if the database file exists
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "Database file not found, creating..."
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
    
    # Run migrations to set up the schema
    echo "Running migrations..."
    php artisan migrate --force
fi

# Execute the main container command
exec "$@"
