package handlers

import (
	"database/sql"
	"net/http"

	"github.com/dennislee928/Carbon_Trading_For_Individuals_Frontend/backend/controllers"
	"github.com/gin-gonic/gin"
)
	

func RegisterUser(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	controllers.RegisterUser(w, r) // Forward to the controller
}

func Home(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Welcome to Carbon Rights Backend API"})
}