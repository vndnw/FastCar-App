package com.example.Backend.repository;

import com.example.Backend.model.BankInformation;
import com.example.Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankInformationRepository extends JpaRepository<BankInformation, Long> {
    BankInformation findBankInformationByAccountNumber(String accountNumber);
    Optional<BankInformation> findByUser(User user);
}
