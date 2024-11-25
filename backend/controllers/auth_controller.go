package controllers

import (
	"carbon-rights-backend/models"
	"carbon-rights-backend/utils"
	"database/sql"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles the user registration process
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	password := r.FormValue("password")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash password: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	otp := utils.GenerateOTP()
	utils.SendOTPEmail(email, otp)

	user := models.User{
		Email:       email,
		PasswordHash: string(hashedPassword),
		OTP:          otp,
		CreatedAt:    time.Now(),
	}

	err = models.CreateUser(user)
	if err != nil {
		log.Printf("Failed to create user: %v", err)
		http.Error(w, "Could not register user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("User registered successfully. Please verify your email."))
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
