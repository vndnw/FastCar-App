package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.DocumentRequest;
import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.service.DocumentService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/document")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<?> getAllDocuments(Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Getting all documents.")
                .data(documentService.getAllDocuments(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Getting document by id.")
                .data(documentService.getDocumentById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Deleting document.")
                .build();
        return ResponseEntity.ok(responseData);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable("id") long id, @RequestBody DocumentRequest documentRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Document Update successfully")
                .data(documentService.updateDocument(id,documentRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/{id}/status") // Update status document  (URL = /document/{id}/status?status=APPROVED)
    public ResponseEntity<?> updateStatusDocument(@PathVariable Long id, @RequestParam("status") String status) {
        DocumentStatus documentStatus = DocumentStatus.valueOf(status.toUpperCase());
        //  có thể cập nhật thêm tính năng thong báo khi document được approve
        if (documentStatus == null) {
            return ResponseEntity.badRequest().body("Invalid document status provided.");
        }
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Updating document status.")
                .data(documentService.updateStatusDocument(id, documentStatus))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/all/user/{userId}")
    public ResponseEntity<?> getAllDocumentsByUserId(@PathVariable Long userId) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Getting all documents by user id.")
                .data(documentService.getAllDocumentsByUserId(userId))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
