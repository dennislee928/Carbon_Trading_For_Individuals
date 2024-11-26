package main

import (
	"database/sql"
	"log"

	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/config"
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/handlers"
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)
func main() {
    // Initialize Router using Gin
    r := gin.Default()

    // Initialize Supabase client
    supabaseClient, err := config.NewSupabaseClient()
    if err != nil {
        log.Fatal("Error initializing Supabase client:", err)
    }

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

    // Start the server
    log.Println("Server is starting on port 8080...")
    if err := r.Run(":8080"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}


func setupRoutes(r *gin.Engine, db *sql.DB) {
    // Apply middleware
    authMiddleware := middleware.AuthMiddleware
    adminMiddleware := middleware.AdminOnly

    // API group
    api := r.Group("/api")
    {
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

            // Account Management
            account := protected.Group("/account")
            {
                account.POST("/change-password", handlers.ChangePassword)
                account.PUT("/notification-preferences", handlers.UpdateNotificationPreferences)
                account.DELETE("/delete", handlers.DeleteAccount)
                account.POST("/recovery-email", handlers.AddRecoveryEmail)
            }

            // Security & Verification
            security := protected.Group("/security")
            {
                security.GET("/login-history", handlers.ViewLoginHistory)
                security.POST("/kyc/upload", handlers.UploadKYCDocument)
            }

            // Admin routes
            admin := protected.Group("/admin")
            admin.Use(adminMiddleware())
            {
                admin.POST("/assign-role", handlers.AssignRole)
                admin.GET("/users", handlers.AdminViewUsers)
            }
        }
    }

    // Home route
    r.GET("/", handlers.Home)
}