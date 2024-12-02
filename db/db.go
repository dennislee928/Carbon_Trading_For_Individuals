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
    // Add debug logging
    log.Println("Starting database initialization...")
    // Get database credentials from environment variables

    
    supabaseURL := os.Getenv("SUPABASE_URL")
    supabaseKey := os.Getenv("SUPABASE_KEY")
// Debug environment variables (don't log the full key in production)
log.Printf("SUPABASE_URL: %s", supabaseURL)
log.Printf("SUPABASE_KEY length: %d", len(supabaseKey))

    //
    if supabaseURL == "" || supabaseKey == "" {
        return nil, fmt.Errorf("missing required environment variables SUPABASE_URL or SUPABASE_KEY")
    }

    // Construct the database URL directly
    dbURL := fmt.Sprintf("postgres://postgres.%s:%s@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=verify-full",
        supabaseURL,
        supabaseKey,
    )
     // Log connection attempt (without credentials)
     log.Printf("Attempting to connect to: postgres://postgres.%s:****@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres", supabaseURL)

    var err error
    DB, err = sql.Open("pgx", dbURL)
    if err != nil {
        return nil, fmt.Errorf("error connecting to the database: %v", err)
    }

    // Test the connection
    if err = DB.Ping(); err != nil {
        return nil, fmt.Errorf("error pinging the database: %v", err)
    }
     // Test the connection
     log.Println("Testing connection with Ping()...")
     if err = DB.Ping(); err != nil {
         return nil, fmt.Errorf("error pinging the database: %v", err)
     }

    // Set connection pool settings
    DB.SetMaxOpenConns(25)
    DB.SetMaxIdleConns(25)
    DB.SetConnMaxLifetime(5 * time.Minute)
    //
    log.Println("Database connection successful!")
    //
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
