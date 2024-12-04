package handlers

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

var jwtSecret = []byte("your-secret-key") // Replace with a secure key

// GenerateJWT creates a JWT with a session identifier (jti)
func GenerateJWT(userID string) (string, error) {
	// Create unique session ID
	sessionID := uuid.New().String()

	// Set claims
	claims := jwt.MapClaims{
		"sub": userID,                // Subject (user ID)
		"jti": sessionID,             // Session identifier
		"exp": time.Now().Add(time.Hour * 24).Unix(), // Expiration time
		"iat": time.Now().Unix(),     // Issued at
	}

	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign token with secret
	return token.SignedString(jwtSecret)
}
