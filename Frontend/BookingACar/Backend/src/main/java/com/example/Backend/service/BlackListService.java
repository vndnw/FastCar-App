package com.example.Backend.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class BlackListService {

    private final RedisTemplate<String, String> redisTemplate;

    public BlackListService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }

    public void saveTokenToBlacklist(String token, String value) {
        redisTemplate.opsForValue().set(token, value, 60, TimeUnit.MINUTES);
    }
}
