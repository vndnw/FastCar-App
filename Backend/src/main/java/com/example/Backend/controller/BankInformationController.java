package com.example.Backend.controller;

import com.example.Backend.service.BankInformationService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bank-information")
public class BankInformationController {

    private final BankInformationService bankInformationService;

    public BankInformationController(BankInformationService bankInformationService) {
        this.bankInformationService = bankInformationService;
    }


}
