package main

import (
	"carbon-rights-backend/config"
	"carbon-rights-backend/routes"
	"log"
	"net/http"
)

func main() {
    // Initialize application configuration (database, environment variables, etc.)
    db := config.InitializeDB()
    defer db.Close() // Close the database connection when the app exits

    // Set up routes using Gorilla Mux
    routes.SetupRoutes()

    // Start the HTTP server
    log.Println("Server is starting on port 8080...")
    if err := http.ListenAndServe(":8080", router); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
