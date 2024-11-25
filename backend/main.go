package main

import (
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

	// Enable CORS
	r.Use(cors.Default())

	// Initialize application configuration (e.g., database)
    db, err := config.InitializeDB()
    if err != nil {
        log.Fatalf("Failed to initialize database: %v", err)
    }
    defer db.Close()
    
    

	// Set up routes
	setupRoutes(r)

	// Start the server
	log.Println("Server is starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(r *gin.Engine) {
	// Apply middleware
	authMiddleware := middleware.AuthMiddleware

	adminMiddleware := middleware.AdminOnly

	// User Registration
	r.POST("/register", func(c *gin.Context) {
        models.RegisterUser(db, c.Writer, c.Request)
    })

	// OTP Verification
	r.POST("/verify-otp", handlers.VerifyOTP)

	// Social Media Login
	r.POST("/social-login/:provider", handlers.SocialLogin)

	// Login
	r.POST("/login", handlers.Login)

	// Password Management
	r.POST("/forgot-password", handlers.ForgotPassword)
	r.POST("/change-password", authMiddleware(), handlers.ChangePassword)

	// Profile Management
	r.GET("/profile", authMiddleware(), handlers.ViewProfile)
	r.PUT("/profile", authMiddleware(), handlers.UpdateProfile)
	r.POST("/profile/picture", authMiddleware(), handlers.UploadProfilePicture)

	// Email & Notification Settings
	r.PUT("/notification-preferences", authMiddleware(), handlers.UpdateNotificationPreferences)

	// User Roles & Permissions
	r.POST("/admin/assign-role", authMiddleware(), adminMiddleware(), handlers.AssignRole)

	// Activity Logs & Security
	r.GET("/login-history", authMiddleware(), handlers.ViewLoginHistory)

	// Admin-Level Account Functions
	r.GET("/admin/users", authMiddleware(), adminMiddleware(), handlers.AdminViewUsers)

	// Account Deletion
	r.DELETE("/delete-account", authMiddleware(), handlers.DeleteAccount)

	// Verification & KYC
	r.POST("/kyc/upload", authMiddleware(), handlers.UploadKYCDocument)

	// Account Recovery
	r.POST("/add-recovery-email", authMiddleware(), handlers.AddRecoveryEmail)

	// Home route
	r.GET("/", handlers.Home)
}
