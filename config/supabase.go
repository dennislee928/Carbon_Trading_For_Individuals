package config

import (
	"fmt"
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

    if supabaseUrl == "" {
        return nil, fmt.Errorf("SUPABASE_URL environment variable is not set")
    }
    if supabaseKey == "" {
        return nil, fmt.Errorf("SUPABASE_KEY environment variable is not set")
    }

    // Log values for debugging
    fmt.Println("Using Supabase URL:", supabaseUrl)
    fmt.Println("Using Supabase Key:", supabaseKey)

    // Create default options or customize as needed
    options := supabase.ClientOptions{}

    client, err := supabase.NewClient(supabaseUrl, supabaseKey, &options)
    if err != nil {
        return nil, err
    }

    return &SupabaseClient{
        Client: client,
    }, nil
}
