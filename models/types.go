package models

type Clients struct {
    User_ID   int    `json:"id"`
	Email string `json:"email"`
    Name string `json:"name"`
	PasswordHash string `json:"password_hash"`
	IsVerified bool `json:"is_verified"`
	FullName string `json:"full_name"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`

    // Add other fields as needed
}
