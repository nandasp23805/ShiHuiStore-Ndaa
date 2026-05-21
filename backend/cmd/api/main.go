package main

import (
	"log"

	"jacket-store/backend/internal/config"
	"jacket-store/backend/internal/database"
	"jacket-store/backend/internal/router"
)

func main() {
	cfg := config.Load()
	db := database.Connect(cfg)
	database.AutoMigrate(db)
	database.Seed(db)

	r := router.Setup(cfg, db)
	log.Printf("ShihuyStore API running on :%s", cfg.AppPort)
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
