package main

import (
	"carbon-rights-backend/config"
	"carbon-rights-backend/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Router using gin
	r := gin.Default()

	// Enable CORS
	r.Use(cors.Default())

	// Initialize application configuration (database, environment variables, etc.)
	db := config.InitializeDB()
	defer db.Close() // Close the database connection when the app exits

	// Set up routes
	setupRoutes(r)

	// Start the server
	log.Println("Server is starting on port 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(r *gin.Engine) {
	// User Registration
	r.POST("/register", register)

	// OTP Verification
	r.POST("/verify-otp", verifyOTP)

	// Social Media Login
	r.POST("/social-login/:provider", socialLogin)

	// Login
	r.POST("/login", login)

	// Password Management
	r.POST("/forgot-password", forgotPassword)
	r.POST("/change-password", authMiddleware(), changePassword)

	// Profile Management
	r.GET("/profile", authMiddleware(), viewProfile)
	r.PUT("/profile", authMiddleware(), updateProfile)
	r.POST("/profile/picture", authMiddleware(), uploadProfilePicture)

	// Email & Notification Settings
	r.PUT("/notification-preferences", authMiddleware(), updateNotificationPreferences)

	// User Roles & Permissions
	r.POST("/admin/assign-role", authMiddleware(), adminOnly(), assignRole)

	// Activity Logs & Security
	r.GET("/login-history", authMiddleware(), viewLoginHistory)

	// Admin-Level Account Functions
	r.GET("/admin/users", authMiddleware(), adminOnly(), adminViewUsers)

	// Account Deletion
	r.DELETE("/delete-account", authMiddleware(), deleteAccount)

	// Verification & KYC
	r.POST("/kyc/upload", authMiddleware(), uploadKYCDocument)

	// Account Recovery
	r.POST("/add-recovery-email", authMiddleware(), addRecoveryEmail)

	// Home route
	r.GET("/", func(c *gin.Context) {
		// handler logic
	})

	// Set up additional routes from the routes package
	routes.SetupRoutes(r)
}
