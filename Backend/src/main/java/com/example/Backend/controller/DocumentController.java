package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.service.DocumentService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/document")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDocuments(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Getting all documents.")
                .data(documentService.getAllDocuments(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
