package middleware

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type JWTClaims struct {
    UserID    uint   `json:"user_id"`
    Email     string `json:"email"`
    Role      string `json:"role"`
    jwt.StandardClaims
}

func ValidateToken(tokenString string) (*JWTClaims, error) {
    // Get secret from environment variable
    secret := os.Getenv("JWT_SECRET")
    if secret == "" {
        return nil, errors.New("JWT_SECRET not set")
    }

    token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
        // Validate signing method
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, errors.New("invalid signing method")
        }
        return []byte(secret), nil
    })

    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*JWTClaims)
    if !ok || !token.Valid {
        return nil, errors.New("invalid token")
    }

    // Additional validation rules
    if claims.ExpiresAt < time.Now().Unix() {
        return nil, errors.New("token expired")
    }

    return claims, nil
}
