package com.example.Backend.exception;

import com.example.Backend.dto.ResponseData;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(@NotNull RuntimeException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(500)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(500).body(errorResponse);
    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(@NotNull ResourceNotFoundException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(404)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(404).body(errorResponse);
    }
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<?> handleResourceAlreadyExistsException(@NotNull ResourceAlreadyExistsException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(409)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(409).body(errorResponse);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleInvalidTokenException(@NotNull IllegalArgumentException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(400)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleInvalidRequestException(ValidationException e, HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(400)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<?> handleRefreshTokenExpiredException(@NotNull RefreshTokenExpiredException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(401)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(401).body(errorResponse);
    }

    @ExceptionHandler(BookingException.class)
    public ResponseEntity<?> handleBookingException(@NotNull BookingException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(400)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<?> handleExpiredJwtException(@NotNull ExpiredJwtException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(401)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(401).body(errorResponse);
    }

    @ExceptionHandler(DiscountException.class)
    public ResponseEntity<?> handleDiscountException(@NotNull DiscountException e, @NotNull HttpServletRequest request) {
        ResponseData<?> errorResponse = ResponseData.builder()
                .status(400)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }
}
