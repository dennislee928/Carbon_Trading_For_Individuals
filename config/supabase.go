package config

import (
	"os"

	"github.com/supabase-community/supabase-go"
)

// Create a Supabase client struct
type SupabaseClient struct {
    Client *supabase.Client
}

// Initialize Supabase client
func NewSupabaseClient() (*SupabaseClient, error) {
    supabaseUrl := os.Getenv("SUPABASE_URL")
    supabaseKey := os.Getenv("SUPABASE_KEY")

    client, err := supabase.NewClient(supabaseUrl, supabaseKey)
    if err != nil {
        return nil, err
    }

    return &SupabaseClient{
        Client: client,
    }, nil
}
