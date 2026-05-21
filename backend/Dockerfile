FROM golang:1.22-alpine AS dev
WORKDIR /app
RUN apk add --no-cache git
COPY go.mod ./
RUN go mod download
COPY . .
EXPOSE 8080
CMD ["go", "run", "./cmd/api"]

FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/api

FROM alpine:3.20 AS prod
WORKDIR /app
RUN adduser -D appuser && mkdir -p uploads && chown -R appuser:appuser /app
USER appuser
COPY --from=builder /server /app/server
EXPOSE 8080
CMD ["/app/server"]

