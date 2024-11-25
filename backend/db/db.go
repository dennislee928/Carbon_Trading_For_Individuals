package db

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5"
)

var DB *sql.DB

// InitializeDB sets up the database connection
func InitializeDB() error {
    connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_HOST"),
        os.Getenv("DB_NAME"),
    )

    var err error
    DB, err = sql.Open("pgx", connStr)
    if err != nil {
        return fmt.Errorf("error opening database: %v", err)
    }

    // Set connection pool settings
    DB.SetMaxOpenConns(25)
    DB.SetMaxIdleConns(5)
    DB.SetConnMaxLifetime(5 * time.Minute)

    // Verify the connection
    err = DB.Ping()
    if err != nil {
        return fmt.Errorf("error connecting to the database: %v", err)
    }

    return nil
}

// CloseDB closes the database connection
func CloseDB() error {
    if DB != nil {
        return DB.Close()
    }
    return nil
}
