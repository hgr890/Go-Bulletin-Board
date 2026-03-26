package main

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Post represents a bulletin board post
type Post struct {
	ID        int       `json:"id"`
	Title     string    `json:"title" binding:"required"`
	Content   string    `json:"content" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
}

var (
	posts  = []Post{}
	nextID = 1
	mu     sync.Mutex
)

func main() {
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API Routes
	api := r.Group("/api")
	{
		api.GET("/posts", getPosts)
		api.POST("/posts", createPost)
	}

	r.Run(":8080") // Start server on port 8080
}

func getPosts(c *gin.Context) {
	mu.Lock()
	defer mu.Unlock()
	c.JSON(http.StatusOK, posts)
}

func createPost(c *gin.Context) {
	var newPost Post
	if err := c.ShouldBindJSON(&newPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mu.Lock()
	newPost.ID = nextID
	nextID++
	newPost.CreatedAt = time.Now()
	posts = append([]Post{newPost}, posts...) // Add to beginning of slice
	mu.Unlock()

	c.JSON(http.StatusCreated, newPost)
}
