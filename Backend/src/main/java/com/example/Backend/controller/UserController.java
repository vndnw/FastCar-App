package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.*;
import com.example.Backend.dto.response.BankInformationResponse;
import com.example.Backend.service.BankInformationService;
import com.example.Backend.service.BookingService;
import com.example.Backend.service.CarService;
import com.example.Backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final CarService carService;
    private final BookingService bookingService;
    private final BankInformationService bankInformationService;

    public UserController(UserService userService,
                          CarService carService,
                          BookingService bookingService,
                          BankInformationService bankInformationService) {
        this.userService = userService;
        this.carService = carService;
        this.bookingService = bookingService;
        this.bankInformationService = bankInformationService;
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping
    public ResponseEntity<?> getAllUsers(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getAllUsers(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getMe())
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getUserById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Success")
                .data(userService.createUser(userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody UpdateUserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.updateUser(id, userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PutMapping("/me/update-info-user")
    public ResponseEntity<?> updateUserInfo(@RequestBody UpdateInfoRequest userRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully updated user information")
                .data(userService.updateUserInfo(email, userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/{id}/addRole")
    public ResponseEntity<?> addRoleToUser(@PathVariable long id, @RequestBody List<String> addRoleRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully added role to user")
                .data(userService.addRolesToUser(id, addRoleRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @PatchMapping("/{email}/activate")
    public ResponseEntity<?> activateUser(@PathVariable String email) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully activated user")
                .data(userService.activeUser(email))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully deleted user")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/bank-information")
    public ResponseEntity<?> addBankInformation(@PathVariable Long id, BankInformationRequest bankInformationRequest) {
        ResponseData<?> response = ResponseData.builder()
                .status(201)
                .message("Bank information added successfully")
                .data(bankInformationService.addBankInformation(id, bankInformationRequest))
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PreAuthorize("hasRole('user')")
    @PutMapping("/{id}/bank-information")
    public ResponseEntity<?> updateBankInformation(@PathVariable Long id, BankInformationRequest bankInformationRequest) {
        ResponseData<?> response = ResponseData.builder()
                .status(200)
                .message("Bank information updated successfully")
                .data(bankInformationService.updateBankInformation(id, bankInformationRequest))
                .build();
        return ResponseEntity.ok(response);
    }

    // khởi tạo kí gửi xe với các thông tin basic  của car sau đó sẽ update thông tin sau
    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/create-car")
    public ResponseEntity<?> depositCar(@PathVariable long id, @RequestBody CarRequest carRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Car added successfully")
                .data(carService.createCar(id, carRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('owner')")
    @GetMapping("/{id}/list-car")
    public ResponseEntity<?> getAllCarByUserId(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(carService.getAllCarsByUserId(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('user')")
    @PostMapping("/{id}/book-car")
    public ResponseEntity<?> bookCar(HttpServletRequest request, @PathVariable long id, @RequestBody BookingRequest bookingRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Booking created successfully")
                .data(bookingService.createBooking(request, id, bookingRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
}
