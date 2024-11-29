package db

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

// InitializeDB sets up the database connection
func InitializeDB() (*sql.DB, error) {
    // Construct the connection string using Supabase credentials
    supabaseURL := os.Getenv("SUPABASE_URL")
    supabaseKey := os.Getenv("SUPABASE_KEY")
    if supabaseURL == "" || supabaseKey == "" {
        return nil, fmt.Errorf("missing required environment variables SUPABASE_URL or SUPABASE_KEY")
    }
    
    // Extract the project reference from Supabase URL
    projectRef := supabaseURL[8:strings.Index(supabaseURL, ".supabase.co")]
    
    // Construct the database URL
    dbURL := fmt.Sprintf("postgres://postgres:%s@db.%s.supabase.co:5432/postgres?sslmode=require", 
        supabaseKey,
        projectRef,
    )

    var err error
    DB, err = sql.Open("pgx", dbURL)
    if err != nil {
        return nil, fmt.Errorf("error connecting to the database: %v", err)
    }

    // Test the connection
    if err = DB.Ping(); err != nil {
        return nil, fmt.Errorf("error pinging the database: %v", err)
    }

    // Set connection pool settings
    DB.SetMaxOpenConns(25)
    DB.SetMaxIdleConns(25)
    
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
