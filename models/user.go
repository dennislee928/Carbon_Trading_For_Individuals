package models

import (
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/db"

	"time"
)

type User struct {
    UserID      string
    Email       string
    PasswordHash string
    OTP         string
    IsVerified  bool
    CreatedAt   time.Time
    UpdatedAt   time.Time
}

// CreateUser inserts a new user into the database
func CreateUser(user User) error {
    _, err := db.DB.Exec("INSERT INTO users (email, password_hash, otp, is_verified, created_at) VALUES ($1, $2, $3, $4, $5)",
        user.Email, user.PasswordHash, user.OTP, false, user.CreatedAt)
    return err
}

// GetUserByEmail retrieves a user by their email
func GetUserByEmail(email string) (User, error) {
    var user User
    err := db.DB.QueryRow("SELECT user_id, email, password_hash, otp, is_verified, created_at, updated_at FROM users WHERE email = $1", email).
        Scan(&user.UserID, &user.Email, &user.PasswordHash, &user.OTP, &user.IsVerified, &user.CreatedAt, &user.UpdatedAt)
    return user, err
}

// VerifyUser sets a user as verified
func VerifyUser(email string) error {
    _, err := db.DB.Exec("UPDATE users SET is_verified = true WHERE email = $1", email)
    return err
}