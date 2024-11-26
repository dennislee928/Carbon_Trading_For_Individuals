package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/controllers"
	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/models"
	"github.com/gin-gonic/gin"
)
	

func RegisterUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	controllers.RegisterUser(w, r) // Forward to the controller
}

func Home(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Welcome to Carbon Rights Backend API"})
}
func CreateClientHandler(w http.ResponseWriter, r *http.Request) {
    var client models.Clients
    if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if err := client.Create(); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(client)
}
