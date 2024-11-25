package main

import (
	"carbon-rights-backend/config"
	"carbon-rights-backend/routes"
	"log"
	"net/http"

	"github.com/gin-gonic/gin" // If using Gin
)

func main() {
    // Initialize Router using gin
    router := gin.Default()
    // Initialize application configuration (database, environment variables, etc.)
    db := config.InitializeDB()
    defer db.Close() // Close the database connection when the app exits

    // Set up routes using Gorilla Mux
    routes.SetupRoutes()
     // Setuproutes
     router.GET("/", func(c *gin.Context) {
        // handler logic
    })
    router.Run(":8080")  

    // Start the HTTP server
    log.Println("Server is starting on port 8080...")
    if err := http.ListenAndServe(":8080", router); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
