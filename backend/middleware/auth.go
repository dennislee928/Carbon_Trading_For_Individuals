package middleware

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// Register handles user registration
func Register(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")

		// TODO: Add email validation logic

		// Hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		// Generate OTP and send email
		otp := generateOTP()
		sendOTPEmail(email, otp)

		// Save user in the database
		_, err = db.Exec("INSERT INTO users (email, password_hash, otp) VALUES ($1, $2, $3)", email, hashedPassword, otp)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	}
}

// VerifyOTP handles OTP verification
func VerifyOTP(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		otp := c.PostForm("otp")

		// Validate OTP
		var storedOTP string
		err := db.QueryRow("SELECT otp FROM users WHERE email=$1", email).Scan(&storedOTP)
		if err != nil || storedOTP != otp {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
			return
		}

		// OTP verified
		c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
	}
}

// Login handles user login
func Login(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")

		var passwordHash string
		err := db.QueryRow("SELECT password_hash FROM users WHERE email=$1", email).Scan(&passwordHash)
		if err != nil || bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password)) != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		// Generate JWT token
		token, err := generateJWT(email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}

// generateJWT is a helper function to generate JWT tokens
func generateJWT(email string) (string, error) {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return "", fmt.Errorf("secret key is not set")
	}

	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = email
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
