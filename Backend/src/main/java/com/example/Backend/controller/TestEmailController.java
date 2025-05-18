package com.example.Backend.controller;


import com.example.Backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/test/email")
public class TestEmailController {
    // This is a placeholder for the actual email sending logic
    // In a real application, you would inject an email service and use it here
    private final EmailService emailService;

    public TestEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Example endpoint to send a test email
     @GetMapping()
     public ResponseEntity<?> sendTestEmail() {
         emailService.sendOTPEmail("xuanduong.261104@gmail.com", "123456");
         return ResponseEntity.ok("Test email sent successfully");
     }
}
