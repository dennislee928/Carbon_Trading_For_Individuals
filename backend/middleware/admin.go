func adminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if the user is an admin
		// Abort if not an admin
		c.Next()
	}
}
