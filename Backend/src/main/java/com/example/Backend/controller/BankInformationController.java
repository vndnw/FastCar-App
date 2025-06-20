package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.BankInformationRequest;
import com.example.Backend.dto.response.BankInformationResponse;
import com.example.Backend.service.BankInformationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bank-information")
public class BankInformationController {

    private final BankInformationService bankInformationService;

    public BankInformationController(BankInformationService bankInformationService) {
        this.bankInformationService = bankInformationService;
    }

    @PostMapping
    public ResponseEntity<?> createBankInformation(@RequestParam("userId") Long userId ,@RequestBody BankInformationRequest bankInformationRequest) {
        ResponseData<?> response = ResponseData.<BankInformationResponse>builder()
                .status(201)
                .message("Bank information created successfully")
                .data(bankInformationService.addBankInformation(userId, bankInformationRequest))
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<?> updateBankInformation(@RequestParam("userId") Long userId, @RequestBody BankInformationRequest bankInformationRequest) {
        ResponseData<?> response = ResponseData.<BankInformationResponse>builder()
                .status(200)
                .message("Bank information updated successfully")
                .data(bankInformationService.updateBankInformation(userId, bankInformationRequest))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<?> getBankInformation(@RequestParam("userId") Long userId) {
        ResponseData<?> response = ResponseData.<BankInformationResponse>builder()
                .status(200)
                .message("Bank information retrieved successfully")
                .data(bankInformationService.getBankInformation(userId))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBankInformation(@PathVariable Long id) {
        bankInformationService.deleteBankInformation(id);
        ResponseData<?> response = ResponseData.builder()
                .status(200)
                .message("Bank information deleted successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBankInformationById(@PathVariable Long id) {
        ResponseData<?> response = ResponseData.<BankInformationResponse>builder()
                .status(200)
                .message("Bank information retrieved successfully")
                .data(bankInformationService.getBankInformationById(id))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}
