package models

import (
	"database/sql"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	password := r.FormValue("password")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	otp := generateOTP()
	sendOTPEmail(email, otp)

	_, err = db.Exec("INSERT INTO users (email, password_hash, otp) VALUES ($1, $2, $3)", email, hashedPassword, otp)
	if err != nil {
		http.Error(w, "Could not register user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
