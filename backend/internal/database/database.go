package database

import (
	"fmt"
	"log"

	"jacket-store/backend/internal/config"
	"jacket-store/backend/internal/domain"
	"jacket-store/backend/internal/utils"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(cfg config.Config) *gorm.DB {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSSLMode,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("database connection failed: ", err)
	}
	return db
}

func AutoMigrate(db *gorm.DB) {
	if err := db.AutoMigrate(
		&domain.User{},
		&domain.Category{},
		&domain.Product{},
		&domain.CartItem{},
		&domain.Order{},
		&domain.OrderItem{},
	); err != nil {
		log.Fatal("migration failed: ", err)
	}
}

func Seed(db *gorm.DB) {
	var count int64
	db.Model(&domain.User{}).Where("email = ?", "admin@shihuystore.test").Count(&count)
	if count == 0 {
		password, _ := utils.HashPassword("password123")
		db.Create(&domain.User{Name: "Admin ShihuyStore", Email: "admin@shihuystore.test", Password: password, Role: "admin"})
	}

	categories := []domain.Category{
		{Name: "Jaket Hoodie", Slug: "jaket-hoodie", ImageURL: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"},
		{Name: "Jaket Denim", Slug: "jaket-denim", ImageURL: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80"},
		{Name: "Jaket Bomber", Slug: "jaket-bomber", ImageURL: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80"},
		{Name: "Jaket Parka", Slug: "jaket-parka", ImageURL: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"},
	}
	for _, category := range categories {
		db.Where(domain.Category{Slug: category.Slug}).FirstOrCreate(&category)
	}

	db.Model(&domain.Product{}).Count(&count)
	if count == 0 {
		var hoodie, denim, bomber, parka domain.Category
		db.Where("slug = ?", "jaket-hoodie").First(&hoodie)
		db.Where("slug = ?", "jaket-denim").First(&denim)
		db.Where("slug = ?", "jaket-bomber").First(&bomber)
		db.Where("slug = ?", "jaket-parka").First(&parka)
		products := []domain.Product{
			{Name: "Noir Signature Hoodie", Description: "Hoodie premium dengan fleece tebal dan siluet modern.", Price: 489000, Stock: 20, Rating: 4.9, ImageURL: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80", CategoryID: hoodie.ID},
			{Name: "Urban Denim Trucker", Description: "Jaket denim clean dengan cutting regular dan detail metal.", Price: 679000, Stock: 16, Rating: 4.8, ImageURL: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80", CategoryID: denim.ID},
			{Name: "Black Flight Bomber", Description: "Bomber hitam elegan dengan lining nyaman untuk harian.", Price: 729000, Stock: 14, Rating: 4.9, ImageURL: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80", CategoryID: bomber.ID},
			{Name: "Arctic Parka Cream", Description: "Parka premium tahan angin dengan aksen krem minimalis.", Price: 899000, Stock: 10, Rating: 4.7, ImageURL: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80", CategoryID: parka.ID},
		}
		db.Create(&products)
	}
}
