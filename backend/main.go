package main

import (
	"carbon-rights-backend/config"
	"carbon-rights-backend/handlers"
	"carbon-rights-backend/middleware"
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
    r.POST("/register", handlers.Register())

    // OTP Verification
    r.POST("/verify-otp", handlers.VerifyOTP())

    // Social Media Login
    r.POST("/social-login/:provider", handlers.SocialLogin())

    // Login
    r.POST("/login", handlers.Login())

    // Password Management
    r.POST("/forgot-password", handlers.ForgotPassword())
    r.POST("/change-password", middleware.AuthMiddleware(), handlers.ChangePassword())

    // Profile Management
    r.GET("/profile", middleware.AuthMiddleware(), handlers.ViewProfile())
    r.PUT("/profile", middleware.AuthMiddleware(), handlers.UpdateProfile)
    r.POST("/profile/picture", middleware.AuthMiddleware(), handlers.UploadProfilePicture())

    // Email & Notification Settings
    r.PUT("/notification-preferences", middleware.AuthMiddleware(), handlers.UpdateNotificationPreferences())

    // User Roles & Permissions
    r.POST("/admin/assign-role", middleware.AuthMiddleware(), middleware.AdminOnly(), handlers.AssignRole())

    // Activity Logs & Security
    r.GET("/login-history", middleware.AuthMiddleware(), handlers.ViewLoginHistory())

    // Admin-Level Account Functions
    r.GET("/admin/users", middleware.AuthMiddleware(), middleware.AdminOnly(), handlers.AdminViewUsers())

    // Account Deletion
    r.DELETE("/delete-account", middleware.AuthMiddleware(), handlers.DeleteAccount())

    // Verification & KYC
    r.POST("/kyc/upload", middleware.AuthMiddleware(), handlers.UploadKYCDocument())

    // Account Recovery
    r.POST("/add-recovery-email", middleware.AuthMiddleware(), handlers.AddRecoveryEmail())

    // Home route
    r.GET("/", handlers.Home)


	// Set up additional routes from the routes package
//	routes.SetupRoutes(r)
}
