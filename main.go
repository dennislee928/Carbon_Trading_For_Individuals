package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/config"
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/handlers"
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/supabase-community/postgrest-go"
)

func main() {
	// Set Gin to release mode in production
	gin.SetMode(gin.ReleaseMode)

	// Initialize Router using Gin
	r := gin.Default()

	// Supabase configuration from environment variables
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("Supabase URL or API Key is not set")
	}

	// Initialize Supabase client with an optional third argument for custom headers
	client := postgrest.NewClient(supabaseURL, supabaseKey, nil)

	// Example query to get data from "profiles" table
	var profiles []map[string]interface{}
	resp, status, err := client.From("profiles").Select("*").Execute(&profiles)
	if err != nil {
		log.Fatalf("Error fetching profiles: %v", err)
	}

	// Output the status, response, and the fetched data
	fmt.Println("Response:", resp)    // Response is typically the raw body or metadata
	fmt.Println("Status:", status)    // HTTP status code
	fmt.Println("Profiles:", profiles)  // The actual data retrieved

	// Initialize database
	db, err := config.InitializeDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer db.Close()

	// Configure CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"*"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}

	// Apply CORS middleware
	r.Use(cors.New(corsConfig))

	// Set up routes with both DB and Supabase client
	setupRoutes(r, db, client)

	// Get port from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server with the correct port
	log.Printf("Server is starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(r *gin.Engine, db *sql.DB, supabaseClient *postgrest.Client) {
	// Apply middleware
	authMiddleware := middleware.AuthMiddleware

	// API group
	api := r.Group("/api")
	{
		// Add a health check endpoint
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Auth routes
		auth := api.Group("/auth")
		{
			// Public routes
			auth.POST("/register", func(c *gin.Context) {
				handlers.RegisterUser(db, c.Writer, c.Request)
			})
			auth.POST("/verify-otp", handlers.VerifyOTP)
			auth.POST("/verify-otp-code", handlers.VerifyOTPCode)
			auth.POST("/login", handlers.Login)
			auth.POST("/social-login/:provider", handlers.SocialLogin)
			auth.POST("/forgot-password", handlers.ForgotPassword)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(authMiddleware())
		{
			// User Profile Management
			profile := protected.Group("/profile")
			{
				profile.GET("", handlers.ViewProfile)
				profile.PUT("", handlers.UpdateProfile)
				profile.POST("/picture", handlers.UploadProfilePicture)
			}
		}
	}
}
