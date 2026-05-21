package handler

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"jacket-store/backend/internal/domain"
	"jacket-store/backend/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	Service *service.Service
}

func New(s *service.Service) *Handler {
	return &Handler{Service: s}
}

type authRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func (h *Handler) Register(c *gin.Context) {
	var req authRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	user, token, err := h.Service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"user": user, "token": token})
}

func (h *Handler) Login(c *gin.Context) {
	var req authRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	user, token, err := h.Service.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user, "token": token})
}

func (h *Handler) Me(c *gin.Context) {
	var user domain.User
	if err := h.Service.Repo.DB.First(&user, c.GetUint("userID")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "user tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *Handler) ListCategories(c *gin.Context) {
	var categories []domain.Category
	h.Service.Repo.DB.Order("name asc").Find(&categories)
	c.JSON(http.StatusOK, categories)
}

func (h *Handler) CreateCategory(c *gin.Context) {
	var category domain.Category
	if err := c.ShouldBindJSON(&category); err != nil || category.Name == "" || category.Slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "nama dan slug wajib diisi"})
		return
	}
	if err := h.Service.Repo.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, category)
}

func (h *Handler) UpdateCategory(c *gin.Context) {
	var category domain.Category
	if err := h.Service.Repo.DB.First(&category, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "kategori tidak ditemukan"})
		return
	}
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	h.Service.Repo.DB.Save(&category)
	c.JSON(http.StatusOK, category)
}

func (h *Handler) DeleteCategory(c *gin.Context) {
	h.Service.Repo.DB.Delete(&domain.Category{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "kategori dihapus"})
}

func (h *Handler) ListProducts(c *gin.Context) {
	products, err := h.Service.Repo.FindProducts(c.Query("search"), c.Query("category"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

func (h *Handler) GetProduct(c *gin.Context) {
	var product domain.Product
	if err := h.Service.Repo.DB.Preload("Category").First(&product, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "produk tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func (h *Handler) CreateProduct(c *gin.Context) {
	product, ok := productFromRequest(c)
	if !ok {
		return
	}
	if err := h.Service.Repo.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	h.Service.Repo.DB.Preload("Category").First(&product, product.ID)
	c.JSON(http.StatusCreated, product)
}

func (h *Handler) UpdateProduct(c *gin.Context) {
	var existing domain.Product
	if err := h.Service.Repo.DB.First(&existing, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "produk tidak ditemukan"})
		return
	}
	product, ok := productFromRequest(c)
	if !ok {
		return
	}
	product.ID = existing.ID
	h.Service.Repo.DB.Save(&product)
	h.Service.Repo.DB.Preload("Category").First(&product, product.ID)
	c.JSON(http.StatusOK, product)
}

func productFromRequest(c *gin.Context) (domain.Product, bool) {
	var product domain.Product
	contentType := c.GetHeader("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		var err error
		product.Name = c.PostForm("name")
		product.Description = c.PostForm("description")
		fmt.Sscanf(c.PostForm("price"), "%f", &product.Price)
		fmt.Sscanf(c.PostForm("stock"), "%d", &product.Stock)
		fmt.Sscanf(c.PostForm("rating"), "%f", &product.Rating)
		fmt.Sscanf(c.PostForm("category_id"), "%d", &product.CategoryID)
		product.ImageURL = c.PostForm("image_url")
		file, fileErr := c.FormFile("image")
		if fileErr == nil {
			name := fmt.Sprintf("%d-%s", time.Now().UnixNano(), filepath.Base(file.Filename))
			path := filepath.Join("uploads", name)
			err = c.SaveUploadedFile(file, path)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"message": "upload gambar gagal"})
				return product, false
			}
			product.ImageURL = "/" + path
		}
	} else if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return product, false
	}
	if product.Name == "" || product.Price <= 0 || product.CategoryID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "nama, harga, dan kategori wajib diisi"})
		return product, false
	}
	if product.Rating == 0 {
		product.Rating = 5
	}
	return product, true
}

func (h *Handler) DeleteProduct(c *gin.Context) {
	h.Service.Repo.DB.Delete(&domain.Product{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "produk dihapus"})
}

type cartRequest struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,min=1"`
}

func (h *Handler) ListCart(c *gin.Context) {
	var items []domain.CartItem
	h.Service.Repo.DB.Preload("Product.Category").Where("user_id = ?", c.GetUint("userID")).Find(&items)
	c.JSON(http.StatusOK, items)
}

func (h *Handler) AddCart(c *gin.Context) {
	var req cartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	var item domain.CartItem
	err := h.Service.Repo.DB.Where("user_id = ? AND product_id = ?", c.GetUint("userID"), req.ProductID).First(&item).Error
	if err == nil {
		item.Quantity += req.Quantity
		h.Service.Repo.DB.Save(&item)
	} else if err == gorm.ErrRecordNotFound {
		item = domain.CartItem{UserID: c.GetUint("userID"), ProductID: req.ProductID, Quantity: req.Quantity}
		h.Service.Repo.DB.Create(&item)
	}
	h.Service.Repo.DB.Preload("Product").First(&item, item.ID)
	c.JSON(http.StatusOK, item)
}

func (h *Handler) UpdateCart(c *gin.Context) {
	var req cartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	var item domain.CartItem
	if err := h.Service.Repo.DB.Where("user_id = ?", c.GetUint("userID")).First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "item tidak ditemukan"})
		return
	}
	item.Quantity = req.Quantity
	h.Service.Repo.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func (h *Handler) DeleteCart(c *gin.Context) {
	h.Service.Repo.DB.Where("user_id = ?", c.GetUint("userID")).Delete(&domain.CartItem{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"message": "item dihapus"})
}

type checkoutRequest struct {
	ShippingName    string `json:"shipping_name" binding:"required"`
	ShippingAddress string `json:"shipping_address" binding:"required"`
	ShippingPhone   string `json:"shipping_phone" binding:"required"`
}

func (h *Handler) Checkout(c *gin.Context) {
	var req checkoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	var cart []domain.CartItem
	h.Service.Repo.DB.Preload("Product").Where("user_id = ?", c.GetUint("userID")).Find(&cart)
	if len(cart) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "keranjang kosong"})
		return
	}
	order := domain.Order{UserID: c.GetUint("userID"), ShippingName: req.ShippingName, ShippingAddress: req.ShippingAddress, ShippingPhone: req.ShippingPhone, Status: "paid"}
	for _, item := range cart {
		order.Total += item.Product.Price * float64(item.Quantity)
		order.Items = append(order.Items, domain.OrderItem{ProductID: item.ProductID, Quantity: item.Quantity, Price: item.Product.Price})
	}
	h.Service.Repo.DB.Create(&order)
	h.Service.Repo.DB.Where("user_id = ?", c.GetUint("userID")).Delete(&domain.CartItem{})
	c.JSON(http.StatusCreated, order)
}

func (h *Handler) ListOrders(c *gin.Context) {
	var orders []domain.Order
	query := h.Service.Repo.DB.Preload("Items.Product").Order("created_at desc")
	if role, _ := c.Get("role"); role != "admin" {
		query = query.Where("user_id = ?", c.GetUint("userID"))
	}
	query.Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func (h *Handler) ListUsers(c *gin.Context) {
	var users []domain.User
	h.Service.Repo.DB.Order("created_at desc").Find(&users)
	c.JSON(http.StatusOK, users)
}
