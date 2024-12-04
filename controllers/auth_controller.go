package controllers

import (
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/models"
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/utils"
	"github.com/gin-gonic/gin"

	"database/sql"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles the user registration process
func RegisterUser(db *sql.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var user struct {
            Email    string `json:"email"`
            Password string `json:"password"`
        }

        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
            return
        }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        log.Printf("Failed to hash password: %v", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
        return
    }

// Use the db connection for database operations
        // Example query (adjust according to your schema):
        _, err = db.Exec(`
            INSERT INTO users (email, password_hash, created_at) 
            VALUES ($1, $2, $3)`,
            user.Email, string(hashedPassword), time.Now(),
        )

        if err != nil {
            log.Printf("Failed to create user: %v", err)
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not register user"})
            return
        }

        c.JSON(http.StatusCreated, gin.H{
            "message": "User registered successfully",
        })
    }
}



// LoginUser handles user login
func LoginUser(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	password := r.FormValue("password")

	user, err := models.GetUserByEmail(email)
	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Printf("Failed to fetch user: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := utils.GenerateJWT(user.Email)
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(token))
}

// VerifyOTP handles OTP verification
func VerifyOTP(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	userOTP := r.FormValue("otp")

	user, err := models.GetUserByEmail(email)
	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Printf("Failed to fetch user: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if user.OTP == userOTP {
		err = models.VerifyUser(email)
		if err != nil {
			log.Printf("Failed to verify user: %v", err)
			http.Error(w, "Failed to verify user", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Account verified successfully"))
	} else {
		http.Error(w, "Invalid OTP", http.StatusUnauthorized)
	}
}
