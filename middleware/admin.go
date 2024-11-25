package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminOnly() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Assume we have a function to check if the user is an admin
        if !isAdmin(c) {
            c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
            c.Abort()
            return
        }
        c.Next()
    }
}

// This function should be implemented based on your authentication system
func isAdmin(c *gin.Context) bool {
    // Example implementation:
    // You might check a session, JWT token, or database to verify admin status
    // For demonstration, let's assume we check a custom header
    adminToken := c.GetHeader("X-Admin-Token")
    return adminToken == "your-secret-admin-token"
}
