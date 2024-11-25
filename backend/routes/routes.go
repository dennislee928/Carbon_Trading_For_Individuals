// routes/routes.go
package routes // NOT package main

import ("github.com/gin-gonic/gin",
 "github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/handlers") // Define your route functions here
func SetupRoutes() {
    // Route setup logic
    router := gin.Default()
    router.POST("/register", handlers.Register)
    router.POST("/verify-otp", handlers.VerifyOTP)
    router.POST("/social-login/:provider", handlers.SocialLogin)
    router.POST("/login", handlers.Login)
    router.POST("/forgot-password", handlers.ForgotPassword)
    router.POST("/change-password", handlers.ChangePassword)
    
}
