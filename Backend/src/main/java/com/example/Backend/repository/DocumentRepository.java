package com.example.Backend.repository;

import com.example.Backend.model.Document;
import com.example.Backend.model.enums.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Page<Document> findAll(Pageable pageable);
    long countByStatus(DocumentStatus status);
    Page<Document> findByStatus(DocumentStatus status, Pageable pageable);
}
