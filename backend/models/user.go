package models

import (
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
