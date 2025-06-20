package com.example.Backend.service;

import com.example.Backend.dto.request.BankInformationRequest;
import com.example.Backend.dto.response.BankInformationResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.mapper.BankInformationMapper;
import com.example.Backend.model.BankInformation;
import com.example.Backend.model.User;
import com.example.Backend.repository.BankInformationRepository;
import com.example.Backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BankInformationService {

    private final BankInformationRepository bankInformationRepository;
    private final BankInformationMapper bankInformationMapper;
    private final UserRepository userRepository;

    public BankInformationService(BankInformationRepository bankInformationRepository,
                                  BankInformationMapper bankInformationMapper,
                                  UserRepository userRepository) {
        this.bankInformationRepository = bankInformationRepository;
        this.bankInformationMapper = bankInformationMapper;
        this.userRepository = userRepository;
    }

    public BankInformationResponse addBankInformation(Long userId, BankInformationRequest bankInformationRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BankInformation bankInformation = BankInformation.builder()
                .user(user)
                .bankName(bankInformationRequest.getBankName())
                .accountNumber(bankInformationRequest.getAccountNumber())
                .accountHolderName(bankInformationRequest.getAccountHolderName())
                .build();
        return bankInformationMapper.mapToResponse(bankInformationRepository.save(bankInformation));
    }

    public BankInformationResponse getBankInformation(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BankInformation bankInformation = bankInformationRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Bank information not found for user"));
        return bankInformationMapper.mapToResponse(bankInformation);
    }

    public BankInformationResponse updateBankInformation(Long userId, BankInformationRequest bankInformationRequest) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BankInformation bankInformation = bankInformationRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Bank information not found for user"));
        bankInformation.setBankName(bankInformationRequest.getBankName());
        bankInformation.setAccountNumber(bankInformationRequest.getAccountNumber());
        bankInformation.setAccountHolderName(bankInformationRequest.getAccountHolderName());
        return bankInformationMapper.mapToResponse(bankInformationRepository.save(bankInformation));
    }

    public void deleteBankInformation(Long id) {
        BankInformation bankInformation = bankInformationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bank information not found with id: " + id));
        bankInformationRepository.delete(bankInformation);
    }

    public Page<BankInformationResponse> getBankInformations(Pageable pageable) {
        Page<BankInformation> bankInformations = bankInformationRepository.findAll(pageable);
        return bankInformations.map(bankInformationMapper::mapToResponse);
    }

    public BankInformationResponse getBankInformationById(Long id) {
        BankInformation bankInformation = bankInformationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bank information not found with id: " + id));
        return bankInformationMapper.mapToResponse(bankInformation);
    }
}
