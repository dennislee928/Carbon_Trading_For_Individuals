package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var jwtSecret = []byte("ThisIsA$trongS3cr3tK3yWith!@#$%^&*") 
var issuer= "https://api.para-universe-energy-exchange-station.com"


//base64:VGhpc0lzQSR0cm9uZ1MzY3IzdEszeVdpdGghQCMkJV4mKg==

// JWTValidation middleware validates the token
var expectedIssuer = "https://your-heroku-app.herokuapp.com" // Match this to the `iss` claim you set in the token

func JWTValidation(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Split(authHeader, " ")[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Validate the issuer
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if claims["iss"] != expectedIssuer {
				http.Error(w, "Invalid token issuer", http.StatusUnauthorized)
				return
			}
		} else {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}



// GenerateJWT generates a JWT with the `iss` claim
func GenerateJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"iss": issuer,               // The issuer
		"sub": userID,               // Subject (user ID)
		"aud": "api.example.com",    // Audience (optional)
		"exp": time.Now().Add(24 * time.Hour).Unix(), // Expiration time
		"iat": time.Now().Unix(),    // Issued at
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

