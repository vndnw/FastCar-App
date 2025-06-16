package com.example.Backend.service;


import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@Service
@Slf4j
public class EmailService {

    @Value("${spring.mail.username}")
    private String FROM_EMAIL;

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOTPEmail(String emailTo, String otp) {

        try{
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            mimeMessageHelper.setFrom(FROM_EMAIL);
            mimeMessageHelper.setTo(emailTo);
            mimeMessageHelper.setSubject("Xác nhận mã OTP");
            String htmlContent = loadHtmlTemplate("templates/OTP.html");
            htmlContent = htmlContent.replace("${otpCode}", otp);

            mimeMessageHelper.setText(htmlContent, true);

            mailSender.send(mimeMessage);

            log.info("OTP email sent successfully to: {}", emailTo);
        }catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", emailTo, e.getMessage(), e);
            e.printStackTrace();
        }

    }

    private String loadHtmlTemplate(String path) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        byte[] bytes = Files.readAllBytes(resource.getFile().toPath());
        return new String(bytes, StandardCharsets.UTF_8);
    }

}
