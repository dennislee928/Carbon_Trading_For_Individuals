func register(c *gin.Context) {
	// Implement user registration logic here
	// Include email verification, OTP generation, and password hashing
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}
func verifyOTP(c *gin.Context) {
	// Implement OTP verification logic
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}
func socialLogin(c *gin.Context) {
	provider := c.Param("provider")
	// Implement social login logic for different providers
	c.JSON(http.StatusOK, gin.H{"message": "Logged in with " + provider})
}
func login(c *gin.Context) {
	// Implement login logic and return JWT token
	token := generateJWT(1) // Replace with actual user ID
	c.JSON(http.StatusOK, gin.H{"token": token})
}
func forgotPassword(c *gin.Context) {
	// Implement password reset logic (send email with reset link or OTP)
	c.JSON(http.StatusOK, gin.H{"message": "Password reset instructions sent"})
}
func changePassword(c *gin.Context) {
	// Implement password change logic for authenticated users
	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}