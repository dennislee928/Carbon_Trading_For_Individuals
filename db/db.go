package db

import (
	"database/sql"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

// InitializeDB sets up the database connection
func InitializeDB()error {
    var err error
    DB, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
    if err != nil {
        return err
    }

    // Test the connection
    if err = DB.Ping(); err != nil {
        return err
    }

    // Set connection pool settings
    DB.SetMaxOpenConns(25)
    DB.SetMaxIdleConns(25)
    
    return nil
}
// CloseDB closes the database connection
func CloseDB() error {
    if DB != nil {
        return DB.Close()
    }
    return nil
}
