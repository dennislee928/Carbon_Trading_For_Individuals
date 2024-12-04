// routes/routes.go
package routes

import (
	"net/http"

	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/handlers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")
	api.GET("/profile", handlers.ViewProfile)
	api.PUT("/profile", handlers.UpdateProfile)
	api.POST("/profile/picture", handlers.UploadProfilePicture)
	api.POST("/register", handlers.Register)
	api.POST("/login", handlers.Login)
	api.POST("/kyc", handlers.UploadKYCDocument)
	api.GET("/admin/users", handlers.AdminViewUsers)
	api.PUT("/admin/role", handlers.AssignRole)
	//api.GET("/notifications", handlers.UpdateNotificationPreferences)
	//api.GET("/login-history", handlers.ViewLoginHistory)
	//api.DELETE("/account", handlers.DeleteAccount)
	//api.POST("/recovery-email", handlers.AddRecoveryEmail)

	api.POST("/verify-otp", handlers.VerifyOTP)
	api.POST("/verify-otp-code", handlers.VerifyOTPCode)
	api.POST("/social-login", handlers.SocialLogin)
	api.POST("/forgot-password", handlers.ForgotPassword)
	api.POST("/change-password", handlers.ChangePassword)
    //debug parts
    api.GET("/register", func(c *gin.Context) {
        c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Use POST for register endpoint"})
    })//this one is for debug
    api.GET("/login", func(c *gin.Context) {
        c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Use POST login this endpoint"})
    })//this one is for debug
    api.GET("/kyc", func(c *gin.Context) {
        c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Use POST kyc this endpoint"})
    })//this one is for debug

	return router
}

