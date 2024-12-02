package config

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func InitializeDB() (*sql.DB, error) {
    // Get database connection URL from environment variables
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        return nil, fmt.Errorf("DATABASE_URL environment variable is not set")
    }

    // Open database connection
    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        return nil, fmt.Errorf("error opening database: %v", err)
    }

    // Test the connection
    err = db.Ping()
    if err != nil {
        return nil, fmt.Errorf("error connecting to the database: %v", err)
    }

    return db, nil
}
