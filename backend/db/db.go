package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB

// InitializeDB sets up the database connection
func InitializeDB() {
    connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_HOST"),
        os.Getenv("DB_NAME"),
    )

    var err error
    DB, err = sql.Open("pgx", connStr)
    if err != nil {
        panic(err)
    }
}