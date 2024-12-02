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

// InitializeDB sets up the database connection
func InitializeDB() (*sql.DB, error) {
    log.Println("Starting database initialization...")

    // Get database credentials from environment variables
    dbUser := "postgres.omlzzhqhuhcpypohelbq"
    dbPassword := os.Getenv("SUPABASE_DB_PASSWORD")
    dbHost := "aws-0-ap-northeast-1.pooler.supabase.com"
    dbPort := "6543"
    
    if dbPassword == "" {
        log.Println("Error: SUPABASE_DB_PASSWORD environment variable is not set")
        return nil, fmt.Errorf("missing required environment variable SUPABASE_DB_PASSWORD")
    }

    // Print environment variable status (without exposing sensitive data)
    log.Printf("Database configuration:")
    log.Printf("- User: %s", dbUser)
    log.Printf("- Host: %s", dbHost)
    log.Printf("- Port: %s", dbPort)
    log.Printf("- Password length: %d", len(dbPassword))

    // Construct the connection string
    connectionString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=postgres sslmode=verify-full",
        dbHost,
        dbPort,
        dbUser,
        dbPassword,
    )

    log.Printf("Attempting database connection to host: %s:%s", dbHost, dbPort)

    var err error
    DB, err = sql.Open("pgx", connectionString)
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
