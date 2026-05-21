package service

import (
	"errors"

	"jacket-store/backend/internal/domain"
	"jacket-store/backend/internal/repository"
	"jacket-store/backend/internal/utils"
)

type Service struct {
	Repo      *repository.Repository
	JWTSecret string
}

func New(repo *repository.Repository, jwtSecret string) *Service {
	return &Service{Repo: repo, JWTSecret: jwtSecret}
}

func (s *Service) Register(name, email, password string) (domain.User, string, error) {
	if name == "" || email == "" || len(password) < 6 {
		return domain.User{}, "", errors.New("nama, email, dan password minimal 6 karakter wajib diisi")
	}
	hash, err := utils.HashPassword(password)
	if err != nil {
		return domain.User{}, "", err
	}
	user := domain.User{Name: name, Email: email, Password: hash, Role: "user"}
	if err := s.Repo.DB.Create(&user).Error; err != nil {
		return domain.User{}, "", err
	}
	token, err := utils.GenerateJWT(s.JWTSecret, user.ID, user.Role)
	return user, token, err
}

func (s *Service) Login(email, password string) (domain.User, string, error) {
	var user domain.User
	if err := s.Repo.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return domain.User{}, "", errors.New("email atau password salah")
	}
	if !utils.CheckPassword(password, user.Password) {
		return domain.User{}, "", errors.New("email atau password salah")
	}
	token, err := utils.GenerateJWT(s.JWTSecret, user.ID, user.Role)
	return user, token, err
}
