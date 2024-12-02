# Start from the official Go image
FROM golang:1.22-alpine

# Install CA certificates
RUN apk add --no-cache ca-certificates

# Copy the custom CA certificate into the container
COPY prod-ca-2021.crt /usr/local/share/ca-certificates/prod-ca-2021.crt
RUN update-ca-certificates

# Set the working directory inside the container
WORKDIR /app

# Copy the entire source code into the container
COPY . .

# Download dependencies and tidy up modules in a single layer
RUN go mod download && go mod tidy

# Build the application
RUN go build -o main .

# Expose the port your application runs on
EXPOSE 8080

# Command to run the application
CMD ["./main"]
