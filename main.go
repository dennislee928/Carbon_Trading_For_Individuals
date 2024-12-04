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
	"github.com/google/uuid"
	"github.com/supabase-community/postgrest-go"
	//"github.com/google/uuid"
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
	supabaseClient := postgrest.NewClient(supabaseURL, supabaseKey, nil)

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
	setupRoutes(r, db, supabaseClient)

	// Get port from environment variable
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
//
kid := uuid.New().String()
	fmt.Println("Generated kid:", kid)
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

		// Add a profiles endpoint that uses Supabase
		api.GET("/profiles", func(c *gin.Context) {
			data, status, err := supabaseClient.From("profiles").Select("*", "", false).Execute()
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			if status != 200 {
				c.JSON(int(status), gin.H{"error": "Failed to fetch profiles"})
				return
			}
			c.Data(200, "application/json", data)
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
func ViewProfile(c *gin.Context) {
	c.JSON(200, gin.H{"message": "ViewProfile handler is not implemented yet"})
}

func UpdateProfile(c *gin.Context) {
	c.JSON(200, gin.H{"message": "UpdateProfile handler is not implemented yet"})
}

func UploadProfilePicture(c *gin.Context) {
	c.JSON(200, gin.H{"message": "UploadProfilePicture handler is not implemented yet"})
}

