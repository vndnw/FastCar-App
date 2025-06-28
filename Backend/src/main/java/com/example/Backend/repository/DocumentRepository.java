package com.example.Backend.repository;

import com.example.Backend.model.Car;
import com.example.Backend.model.Document;
import com.example.Backend.model.User;
import com.example.Backend.model.enums.DocumentStatus;
import com.example.Backend.model.enums.DocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Page<Document> findAll(Pageable pageable);
    long countByStatus(DocumentStatus status);
    Page<Document> findByStatus(DocumentStatus status, Pageable pageable);

    Optional<Document> findDocumentByUserAndDocumentType(User user, DocumentType documentType);
    Optional<Document> findDocumentByCarAndDocumentType(Car car, DocumentType documentType);

    List<Document> findAllByUser(User user);
}
