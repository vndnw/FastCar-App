package com.example.Backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        // Log lỗi để debug
        System.err.println("Unauthorized error: " + authException.getMessage());

        // Thiết lập mã trạng thái HTTP là 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json"); // Đặt Content-Type là JSON
        response.setCharacterEncoding("UTF-8");

        // Tạo một đối tượng JSON chứa thông tin lỗi
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", System.currentTimeMillis());
        errorDetails.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        errorDetails.put("message", "Invalid JWT Token"); // Hoặc thông báo cụ thể hơn
        errorDetails.put("path", request.getRequestURI());

        // Ghi đối tượng JSON vào response body
        objectMapper.writeValue(response.getWriter(), errorDetails);
    }
}
