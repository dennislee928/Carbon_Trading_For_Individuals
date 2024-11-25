package controllers

import (
	"carbon-rights-backend/models"
	"carbon-rights-backend/utils"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles user registration
func RegisterUser(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		otp := utils.GenerateOTP()
		utils.SendOTPEmail(email, otp)

		user := models.User{
			Email:        email,
			PasswordHash: string(hashedPassword),
			OTP:          otp,
			CreatedAt:    time.Now(),
		}

		err = models.CreateUser(db, user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	}
}

// LoginUser handles user login
func LoginUser(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		password := c.PostForm("password")

		user, err := models.GetUserByEmail(db, email)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		token, err := utils.GenerateJWT(user.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}

// VerifyOTP handles OTP verification
func VerifyOTP(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		email := c.PostForm("email")
		userOTP := c.PostForm("otp")

		user, err := models.GetUserByEmail(db, email)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
			return
		}

		if user.OTP == userOTP {
			err = models.VerifyUser(db, email)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user"})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "Account verified successfully"})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		}
	}
}
