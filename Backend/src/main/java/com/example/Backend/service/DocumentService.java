package com.example.Backend.service;

import com.example.Backend.dto.request.DocumentRequest;
import com.example.Backend.dto.response.DocumentResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.DocumentMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.Document;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.DocumentRepository;
import com.example.Backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.print.Doc;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;
    private final CarRepository carRepository;

    public DocumentService(DocumentRepository documentRepository, DocumentMapper documentMapper, CarRepository carRepository) {
        this.documentRepository = documentRepository;
        this.documentMapper = documentMapper;
        this.carRepository = carRepository;
    }

    public Page<DocumentResponse> getAllDocuments(Pageable pageable) {
        Page<Document> documents = documentRepository.findAll(pageable);
        return documents.map(document -> documentMapper.mapToResponse(document));
    }
    public DocumentResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        return documentMapper.mapToResponse(document);
    }
    public DocumentResponse createDocument(long userId , DocumentRequest documentRequest) {

        Car car = carRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        Document document = Document.builder()
                .documentNumber(documentRequest.getDocumentNumber())
                .car(car)
                .description(documentRequest.getDescription())
                .documentType(documentRequest.getDocumentType())
                .imageFrontUrl(documentRequest.getImageFrontUrl())
                .imageBackUrl(documentRequest.getImageBackUrl())
                .expiryDate(documentRequest.getExpiryDate())
                .issueDate(documentRequest.getIssueDate())
                .active(false)
                .build();
        return documentMapper.mapToResponse(documentRepository.save(document));
    }
    public DocumentResponse updateDocument(long id, DocumentRequest documentRequest) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        document.setDocumentNumber(documentRequest.getDocumentNumber());
        document.setDescription(documentRequest.getDescription());
        document.setDocumentType(documentRequest.getDocumentType());
        document.setImageFrontUrl(documentRequest.getImageFrontUrl());
        document.setImageBackUrl(documentRequest.getImageBackUrl());
        document.setExpiryDate(documentRequest.getExpiryDate());
        document.setIssueDate(documentRequest.getIssueDate());
        return documentMapper.mapToResponse(documentRepository.save(document));
    }
    public DocumentResponse updateActiveDocument(long id, boolean isActive) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        document.setActive(isActive);
        return documentMapper.mapToResponse(documentRepository.save(document));
    }
    public void deleteDocument(long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        documentRepository.delete(document);
    }
}
