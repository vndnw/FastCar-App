package com.example.Backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    Page<User> findAll(Pageable pageable);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);

//    Page<User> searchUser(String name, String email, String phone, Pageable pageable);
}
