package com.example.Backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class DotenvApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Dotenv dotenv = Dotenv.load(); // Tự động đọc file .env

        dotenv.entries().forEach(entry -> {
            // Đặt mỗi key-value trong .env thành System property
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}
