// routes/routes.go
package routes

import (
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/handlers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
    router := gin.Default()

    // API group
    api := router.Group("/api")
    {
        // Auth group
        auth := api.Group("/auth")
        {
            // Public routes
            auth.POST("/register", handlers.Register)
            auth.POST("/verify-otp", handlers.VerifyOTP)         // Send OTP
            auth.POST("/verify-otp-code", handlers.VerifyOTPCode) // Verify OTP code
            auth.POST("/login", handlers.Login)
            auth.POST("/social-login/:provider", handlers.SocialLogin)
            auth.POST("/forgot-password", handlers.ForgotPassword)

            // Protected routes (require authentication)
            protected := auth.Group("")
            protected.Use(handlers.AuthMiddleware()) // You'll need to implement this middleware
            {
                protected.POST("/change-password", handlers.ChangePassword)
            }
        }
    }

    // CORS Configuration
    router.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    })

    return router
}
