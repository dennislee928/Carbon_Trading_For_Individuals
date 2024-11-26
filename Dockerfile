# Start from the official Go image
FROM golang:1.22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

#Tids up go modules
RUN go mod tidy

# Copy the source code into the container
COPY . .

# Build the application
RUN go build -o main .

# Expose the port your application runs on
# (Update this port number to match your application's port)
EXPOSE 8080

# Command to run the application
CMD ["./main"]
