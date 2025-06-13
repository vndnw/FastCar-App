package com.example.Backend.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;

    public OtpService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateOtp(String email) {
        SecureRandom secureRandom = new SecureRandom();
        int otp = 100000 + secureRandom.nextInt(900000);
        String otpString = String.format("%06d", otp);
        String key = "Otp:" + email; // Generate a 4-digit OTP
        redisTemplate.opsForValue().set(key, otpString, 5, TimeUnit.MINUTES); // Store OTP in Redis with a 5-minute expiration
        return otpString;
    }

    public boolean validateOtp(String otp, String email){
        String key = "Otp:" + email;
        String storedOtp = redisTemplate.opsForValue().get(key);
        if (storedOtp == null) {
            throw new RuntimeException("OTP expired or not found");
        }
        if (!storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        redisTemplate.delete(key);
        return true;
    }
}
