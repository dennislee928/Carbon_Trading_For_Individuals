package config

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq" // PostgreSQL driver
)

func InitializeDB() (*sql.DB, error) {
    // Get database connection details from environment variables
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    // If environment variables are not set, use defaults
    if dbHost == "" {
        dbHost = "localhost"
    }
    if dbPort == "" {
        dbPort = "5432"
    }
    if dbUser == "" {
        dbUser = "postgres"
    }
    if dbName == "" {
        dbName = "carbon_trading"
    }

    // Create the connection string
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        dbHost, dbPort, dbUser, dbPassword, dbName,
    )

    // Open database connection
    db, err := sql.Open("postgres", connStr)
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