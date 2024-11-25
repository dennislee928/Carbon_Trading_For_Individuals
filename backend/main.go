package main

import (
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
    email := r.FormValue("email")
    password := r.FormValue("password")
    
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

    otp := generateOTP() // function to generate OTP
    sendOTPEmail(email, otp) // send OTP to user email for verification

    // Insert user details into Supabase
    _, err = db.Exec("INSERT INTO users (email, password_hash, otp) VALUES (?, ?, ?)", email, hashedPassword, otp)
    if err != nil {
        http.Error(w, "Could not register user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
}
