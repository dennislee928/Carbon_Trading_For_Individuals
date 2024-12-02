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
    dbUser := "postgres.omlzzhqhuhcpypohelbq"  // Your specific Supabase postgres user
    dbPassword := os.Getenv("SUPABASE_DB_PASSWORD")
    dbHost := "aws-0-ap-northeast-1.pooler.supabase.com"
    dbPort := "6543"  // Note the specific port 6543
    
    if dbPassword == "" {
        return nil, fmt.Errorf("missing required environment variable SUPABASE_DB_PASSWORD")
    }

    // Construct the database URL using the correct format
    dbURL := fmt.Sprintf("postgresql://%s:%s@%s:%s/postgres?sslmode=verify-full",
        dbUser,
        dbPassword,
        dbHost,
        dbPort,
    )

    // Log connection attempt (without credentials)
    log.Printf("Attempting to connect to: postgresql://%s:****@%s:%s/postgres", 
        dbUser, 
        dbHost, 
        dbPort,
    )

    var err error
    DB, err = sql.Open("pgx", dbURL)
    if err != nil {
        return nil, fmt.Errorf("error connecting to the database: %v", err)
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
