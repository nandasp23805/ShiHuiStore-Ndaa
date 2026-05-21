package repository

import (
	"strings"

	"jacket-store/backend/internal/domain"

	"gorm.io/gorm"
)

type Repository struct {
	DB *gorm.DB
}

func New(db *gorm.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) FindProducts(search, category string) ([]domain.Product, error) {
	var products []domain.Product
	query := r.DB.Preload("Category").Order("created_at desc")
	if search != "" {
		like := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(products.name) LIKE ? OR LOWER(products.description) LIKE ?", like, like)
	}
	if category != "" {
		query = query.Joins("JOIN categories ON categories.id = products.category_id").Where("categories.slug = ?", category)
	}
	return products, query.Find(&products).Error
}
