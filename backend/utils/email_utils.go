package utils

import (
	"fmt"
	"net/smtp"
)

// SendOTPEmail sends an OTP to the provided email address
func SendOTPEmail(to string, otp string) {
    from := "your_email@example.com"
    password := "your_email_password"

    smtpHost := "smtp.example.com"
    smtpPort := "587"

    message := fmt.Sprintf("Subject: Your OTP Code\n\nYour OTP code is %s", otp)

    auth := smtp.PlainAuth("", from, password, smtpHost)
    err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(message))
    if err != nil {
        fmt.Println("Failed to send email:", err)
    }
}