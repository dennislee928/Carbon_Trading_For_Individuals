package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)



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
	token, err := generateJWT(1) // Replace with actual user ID
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
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
//
func generateJWT(userID int) (string, error) {
	// Create a new token object, specifying signing method and the claims
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix() // Token expires in 24 hours

	// Sign and get the complete encoded token as a string
	tokenString, err := token.SignedString([]byte("your_secret_key")) // Replace with a secure secret key

	if err != nil {
		return "", err
	}

	return tokenString, nil
}