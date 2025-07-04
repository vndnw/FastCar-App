package com.example.Backend.service;

import com.example.Backend.dto.request.DocumentRequest;
import com.example.Backend.dto.response.DocumentResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.DocumentMapper;
import com.example.Backend.model.Car;
import com.example.Backend.model.Document;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.model.enums.DocumentType;
import com.example.Backend.repository.CarRepository;
import com.example.Backend.repository.DocumentRepository;
import com.example.Backend.repository.UserRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.util.List;


@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final LocationService locationService;

    public DocumentService(DocumentRepository documentRepository,
                           DocumentMapper documentMapper,
                           CarRepository carRepository,
                           UserRepository userRepository,
                           LocationService locationService) {
        this.documentRepository = documentRepository;
        this.documentMapper = documentMapper;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.locationService = locationService;
    }

    public Page<DocumentResponse> getAllDocuments(Pageable pageable) {
        Page<Document> documents = documentRepository.findAll(pageable);
        return documents.map(documentMapper::mapToResponse);
    }
    public DocumentResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        return documentMapper.mapToResponse(document);
    }

    public DocumentResponse createDocumentUser(long userId , @NotNull DocumentRequest documentRequest) {

        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));

        Document document = Document.builder()
                .user(user)
                .issueDate(documentRequest.getIssueDate())
                .expiryDate(documentRequest.getExpiryDate())
                .name(documentRequest.getFullName())
                .gender(documentRequest.getGender())
                .serialNumber(documentRequest.getSerialNumber())
                .dateOfBirth(documentRequest.getDateOfBirth())
                .placeOfIssue(documentRequest.getPlaceOfIssue())
                .location(locationService.checkLocation(documentRequest.getLocation()))
                .documentType(documentRequest.getDocumentType())
                .imageFrontUrl(documentRequest.getImageFrontUrl())
                .imageBackUrl(documentRequest.getImageBackUrl())
                .status(DocumentStatus.PENDING)
                .active(false)
                .build();
        return documentMapper.mapToResponse(documentRepository.save(document));
    }

    public DocumentResponse updateDocument(long id, @NotNull DocumentRequest documentRequest) {
        Document document = documentRepository.findDocumentByUser_idAndDocumentType(id, documentRequest.getDocumentType()).orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        document.setSerialNumber(documentRequest.getSerialNumber());
        document.setName(documentRequest.getFullName());
        document.setGender(documentRequest.getGender());
        document.setRankLicense(documentRequest.getRankLicense());
        document.setDateOfBirth(documentRequest.getDateOfBirth());
        document.setIssueDate(documentRequest.getIssueDate());
        document.setExpiryDate(documentRequest.getExpiryDate());
        document.setPlaceOfIssue(documentRequest.getPlaceOfIssue());
        document.setLocation(locationService.checkLocation(documentRequest.getLocation()));
        document.setDocumentType(documentRequest.getDocumentType());
        document.setImageFrontUrl(documentRequest.getImageFrontUrl());
        document.setImageBackUrl(documentRequest.getImageBackUrl());
        return documentMapper.mapToResponse(documentRepository.save(document));
    }

    // có thể cập nhật trạng thái của document và có thể bổ xung thêm tính năng thông báo khi document được approve
    public DocumentResponse updateStatusDocument(long id, @NotNull DocumentStatus documentStatus) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        if(documentStatus.equals(DocumentStatus.APPROVED)) {
            document.setStatus(DocumentStatus.APPROVED);
            document.setActive(true);
        }
        else {
            document.setStatus(documentStatus);
            document.setActive(false);
        }
        return documentMapper.mapToResponse(documentRepository.save(document));
    }
    public void deleteDocument(long id) {
        Document document = documentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        documentRepository.delete(document);
    }


    public Document getDocumentByUserAndType(User user , DocumentType documentType) {
        return documentRepository.findDocumentByUserAndDocumentType(user, documentType)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found for the given user and type"));
    }

    public DocumentResponse getDocumentByUserIdAndDocumentType(long id , DocumentType documentType) {
        Document document = documentRepository.findDocumentByUser_idAndDocumentType(id, documentType)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found for user with id: " + id + " and type: " + documentType));
        return documentMapper.mapToResponse(document);
    }

    public Object getAllDocumentsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        List<Document> documents = documentRepository.findAllByUser(user);
        if (documents.isEmpty()) {
            throw new ResourceNotFoundException("No documents found for user with id: " + userId);
        }
        return documents.stream().map(documentMapper::mapToResponse);
    }


    public boolean checkIfDocumentExistsByUserAndType(User user, DocumentType documentType) {
        return documentRepository.findDocumentByUserAndDocumentType(user, documentType).isPresent();
    }
}
