package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

// InitializeDB sets up the database connection using the DATABASE_URL environment variable!
func InitializeDB() (*sql.DB, error) {
    log.Println("Starting database initialization...")

    // Get the DATABASE_URL from environment variables
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        log.Println("Error: DATABASE_URL environment variable is not set")
        return nil, fmt.Errorf("missing required environment variable DATABASE_URL")
    }
    log.Println("Using DATABASE_URL:", dbURL) // Log the DATABASE_URL for debugging

    // Print environment variable status (without exposing sensitive data)
    log.Printf("Database configuration:")
    log.Printf("- DATABASE_URL is set")

    log.Printf("Attempting database connection to: %s", dbURL)

    var err error
    DB, err = sql.Open("pgx", dbURL)
    if err != nil {
        log.Printf("Error opening database: %v", err)
        return nil, fmt.Errorf("error opening database: %v", err)
    }

    // Test the connection
    log.Println("Testing connection with Ping()...")
    if err = DB.Ping(); err != nil {
        log.Printf("Error pinging database: %v", err)
        return nil, fmt.Errorf("error pinging database: %v", err)
    }

    // Set connection pool settings
    DB.SetMaxOpenConns(25)
    DB.SetMaxIdleConns(25)
    DB.SetConnMaxLifetime(5 * time.Minute)

    log.Println("Database connection successful!")
    return DB, nil
}

func CloseDB() error {
    if DB != nil {
        return DB.Close()
    }
    return nil
}

// GetDB returns the database instance
func GetDB() *sql.DB {
    return DB
}
