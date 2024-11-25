package models

import (
	"database/sql"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	password := r.FormValue("password")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	otp := generateOTP()
	sendOTPEmail(email, otp)

	_, err = db.Exec("INSERT INTO users (email, password_hash, otp) VALUES ($1, $2, $3)", email, hashedPassword, otp)
	if err != nil {
		http.Error(w, fmt.Sprintf("Database error: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// generateOTP generates a random 6-digit OTP
func generateOTP() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

// sendOTPEmail sends an OTP to the user's email address
func sendOTPEmail(email, otp string) {
	// TODO: Implement email-sending logic using an email service
	fmt.Printf("Sending OTP %s to email %s\n", otp, email)
}
