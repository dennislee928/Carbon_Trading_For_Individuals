package models

import (
	"time"

	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/db"
)

type Clients struct {
    User_ID      int       `json:"id"`
    Email        string    `json:"email"`
    Name         string    `json:"name"`
    PasswordHash string    `json:"password_hash"`
    IsVerified   bool      `json:"is_verified"`
    FullName     string    `json:"full_name"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}

// Get client by ID
func GetClient(id int) (*Clients, error) {
    client := &Clients{}
    err := db.DB.QueryRow(`
        SELECT user_id, email, name, password_hash, is_verified, full_name, created_at, updated_at 
        FROM clients WHERE user_id = $1`, id).Scan(
        &client.User_ID,
        &client.Email,
        &client.Name,
        &client.PasswordHash,
        &client.IsVerified,
        &client.FullName,
        &client.CreatedAt,
        &client.UpdatedAt,
    )
    if err != nil {
        return nil, err
    }
    return client, nil
}

// Update client
func (c *Clients) Update() error {
    _, err := db.DB.Exec(`
        UPDATE clients 
        SET email = $1, name = $2, is_verified = $3, full_name = $4, updated_at = NOW()
        WHERE user_id = $5`,
        c.Email,
        c.Name,
        c.IsVerified,
        c.FullName,
        c.User_ID,
    )
    return err
}

// Create new client
func (c *Clients) Create() error {
    return db.DB.QueryRow(`
        INSERT INTO clients (email, name, password_hash, is_verified, full_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING user_id, created_at, updated_at`,
        c.Email,
        c.Name,
        c.PasswordHash,
        c.IsVerified,
        c.FullName,
    ).Scan(&c.User_ID, &c.CreatedAt, &c.UpdatedAt)
}
