package db

import (
	"database/sql"
	"fmt"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

// InitializeDB sets up the database connection
func InitializeDB() (*sql.DB, error) {
	// Example connection string
	connStr := "user=username dbname=mydb sslmode=disable password=mypassword"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %v", err)
	}
	// Verify connection
	if err = db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping the database: %v", err)
	}
	return db, nil
}

// CloseDB closes the database connection
func CloseDB() error {
    if DB != nil {
        return DB.Close()
    }
    return nil
}
