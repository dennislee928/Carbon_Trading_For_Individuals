package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		// Extract token from the header
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader { // No "Bearer " prefix
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			return
		}

		// TODO: Implement JWT token validation logic
		// For example:
		// userID, err := utils.ValidateJWT(token)
		// if err != nil {
		// 	 c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		//   return
		// }

		// Set user ID in context (placeholder logic)
		c.Set("userID", "example-user-id")

		// Proceed to the next handler
		c.Next()
	}
}
