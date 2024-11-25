package db

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// InitializeDB sets up the database connection
func InitializeDB() *sql.DB {
    err := godotenv.Load()
    if err != nil {
        panic("Error loading .env file")
    }

    connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_HOST"),
        os.Getenv("DB_NAME"),
    )

    db, err := sql.Open("postgres", connStr)
    if err != nil {
        panic(err)
    }

    return db
}