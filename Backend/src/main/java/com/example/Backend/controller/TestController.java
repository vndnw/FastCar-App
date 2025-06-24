package com.example.Backend.controller;


import com.example.Backend.service.CloudinaryService;
import com.example.Backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/test")
public class TestController {
    // This is a placeholder for the actual email sending logic
    // In a real application, you would inject an email service and use it here
    private final EmailService emailService;
    private final CloudinaryService cloudinaryService;
    public TestController(EmailService emailService, CloudinaryService cloudinaryService) {
        this.emailService = emailService;
        this.cloudinaryService = cloudinaryService;
    }
    // Example endpoint to send a test email
     @GetMapping("/sendEmail")
     public ResponseEntity<?> sendTestEmail() {
         emailService.sendOTPEmail("xuanduong.261104@gmail.com", "123456");
         return ResponseEntity.ok("Test email sent successfully");
     }
     @PostMapping("/uploadImage")
     public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String image = cloudinaryService.uploadImage(file);
        return ResponseEntity.ok(image);
     }
}
