package com.example.Backend.exception;

import com.example.Backend.dto.ResponseData;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        ResponseData errorResponse = ResponseData.builder()
                .status(500)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(500).body(errorResponse);
    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest request) {
        ResponseData errorResponse = ResponseData.builder()
                .status(404)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(404).body(errorResponse);
    }
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<?> handleResourceAlreadyExistsException(ResourceAlreadyExistsException e, HttpServletRequest request) {
        ResponseData errorResponse = ResponseData.builder()
                .status(409)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(409).body(errorResponse);
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleInvalidTokenException(IllegalArgumentException e, HttpServletRequest request) {
        ResponseData errorResponse = ResponseData.builder()
                .status(400)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }
//    @ExceptionHandler(InvalidRequestException.class)
//    public ResponseEntity<?> handleInvalidRequestException(InvalidRequestException e, HttpServletRequest request) {
//        ResponseData errorResponse = ResponseData.builder()
//                .status(400)
//                .timestamp(LocalDateTime.now())
//                .message(e.getMessage())
//                .path(request.getRequestURI())
//                .build();
//        return ResponseEntity.status(400).body(errorResponse);
//    }
    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<?> handleRefreshTokenExpiredException(RefreshTokenExpiredException e, HttpServletRequest request) {
        ResponseData errorResponse = ResponseData.builder()
                .status(401)
                .timestamp(LocalDateTime.now())
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(401).body(errorResponse);
    }
}
