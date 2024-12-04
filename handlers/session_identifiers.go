package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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
//
// Example handler to include session identifiers in response
func SessionIdHandler(c *gin.Context) {
	// Simulate session identifiers
	sessionID := "unique-session-id-1"
	petStoreSessionID := "unique-session-id-2"
	xSessionID := "unique-session-id-3"
	cookieSessionID := "unique-session-cookie"

	// Add headers to the response
	c.Header("session-identifier-mdias", sessionID)
	c.Header("session-identifier-petstoreapi-mdias", petStoreSessionID)
	c.Header("x-session-id", xSessionID)

	// Set cookie for session_id
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "session_id",
		Value:    cookieSessionID,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
	})

	// Respond to the client
	c.JSON(http.StatusOK, gin.H{
		"message": "Response includes session identifiers",
	})
}
//


func generateSessionID() string {
    return uuid.New().String()
}

//
func LogSessionIdentifiers(c *gin.Context) {
	// Log incoming session identifiers
	sessionID := c.GetHeader("session-identifier-mdias")
	petStoreSessionID := c.GetHeader("session-identifier-petstoreapi-mdias")
	xSessionID := c.GetHeader("x-session-id")
	cookieSessionID, _ := c.Cookie("session_id")

	log.Printf("Session Identifiers: mdias=%s, petstoreapi=%s, x-session-id=%s, cookie-session=%s",
		sessionID, petStoreSessionID, xSessionID, cookieSessionID)
}



