package router

import (
	"jacket-store/backend/internal/config"
	"jacket-store/backend/internal/handler"
	"jacket-store/backend/internal/middleware"
	"jacket-store/backend/internal/repository"
	"jacket-store/backend/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(cfg config.Config, db *gorm.DB) *gin.Engine {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	r.Static("/uploads", "./uploads")

	h := handler.New(service.New(repository.New(db), cfg.JWTSecret))
	api := r.Group("/api/v1")
	api.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })
	api.POST("/auth/register", h.Register)
	api.POST("/auth/login", h.Login)
	api.GET("/categories", h.ListCategories)
	api.GET("/products", h.ListProducts)
	api.GET("/products/:id", h.GetProduct)

	auth := api.Group("")
	auth.Use(middleware.Auth(cfg.JWTSecret))
	auth.GET("/auth/me", h.Me)
	auth.GET("/cart", h.ListCart)
	auth.POST("/cart", h.AddCart)
	auth.PUT("/cart/:id", h.UpdateCart)
	auth.DELETE("/cart/:id", h.DeleteCart)
	auth.POST("/checkout", h.Checkout)
	auth.GET("/orders", h.ListOrders)

	admin := auth.Group("/admin")
	admin.Use(middleware.AdminOnly())
	admin.GET("/users", h.ListUsers)
	admin.POST("/categories", h.CreateCategory)
	admin.PUT("/categories/:id", h.UpdateCategory)
	admin.DELETE("/categories/:id", h.DeleteCategory)
	admin.POST("/products", h.CreateProduct)
	admin.PUT("/products/:id", h.UpdateProduct)
	admin.DELETE("/products/:id", h.DeleteProduct)

	return r
}
