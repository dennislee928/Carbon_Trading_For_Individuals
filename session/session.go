package session

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"time"
)

type Session struct {
    ID        string
    UserID    uint
    CreatedAt time.Time
    ExpiresAt time.Time
    UserAgent string
    IPAddress string
}

func GenerateSessionID() string {
    b := make([]byte, 32)
    rand.Read(b)
    return base64.URLEncoding.EncodeToString(b)
}

type SessionStore struct {
    db *sql.DB
}

func (s *SessionStore) CreateSession(userID uint, userAgent, ipAddress string) (*Session, error) {
    session := &Session{
        ID:        GenerateSessionID(),
        UserID:    userID,
        CreatedAt: time.Now(),
        ExpiresAt: time.Now().Add(24 * time.Hour), // 24 hour expiry
        UserAgent: userAgent,
        IPAddress: ipAddress,
    }

    // Store session in database
    _, err := s.db.Exec(`
        INSERT INTO sessions (id, user_id, created_at, expires_at, user_agent, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
    `, session.ID, session.UserID, session.CreatedAt, session.ExpiresAt, session.UserAgent, session.IPAddress)

    if err != nil {
        return nil, err
    }

    return session, nil
}

func (s *SessionStore) ValidateSession(sessionID string) (*Session, error) {
    session := &Session{}
    err := s.db.QueryRow(`
        SELECT id, user_id, created_at, expires_at, user_agent, ip_address
        FROM sessions 
        WHERE id = ? AND expires_at > ?
    `, sessionID, time.Now()).Scan(
        &session.ID,
        &session.UserID,
        &session.CreatedAt,
        &session.ExpiresAt,
        &session.UserAgent,
        &session.IPAddress,
    )

    if err != nil {
        return nil, err
    }

    return session, nil
}
