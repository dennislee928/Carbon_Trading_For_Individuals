# Start from the official Go image
FROM golang:1.22-alpine

# Set environment variables in the Dockerfile (optional, not necessary for Heroku)
ENV DATABASE_URL=${DATABASE_URL}


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
