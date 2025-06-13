package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.BookingRequest;
import com.example.Backend.dto.request.CarRequest;
import com.example.Backend.dto.request.UserRequest;
import com.example.Backend.service.BookingService;
import com.example.Backend.service.CarService;
import com.example.Backend.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final CarService carService;
    private final BookingService bookingService;

    public UserController(UserService userService, CarService carService, BookingService bookingService) {
        this.userService = userService;
        this.carService = carService;
        this.bookingService = bookingService;
    }
    @GetMapping
    public ResponseEntity<?> getAllUsers(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getAllUsers(pageable))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getMe())
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.getUserById(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
//    @GetMapping("/search")
//    public ResponseEntity<?> searchUser(String name, String email, String phone, Pageable pageable) {
//        ResponseData<?> responseData = ResponseData.builder()
//                .status(200)
//                .message("Success")
//                .data(userService.searchUser(name, email, phone, pageable))
//                .build();
//        return new ResponseEntity<>(responseData, HttpStatus.OK);
//    }
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Success")
                .data(userService.createUser(userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable long id, @RequestBody UserRequest userRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(userService.updateUser(id, userRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Successfully deleted user")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // khởi tạo kí gửi xe với các thông tin basic  của car sau đó sẽ update thông tin sau
    @PostMapping("/{id}/create-car")
    public ResponseEntity<?> depositCar(@PathVariable long id, @RequestBody CarRequest carRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Car added successfully")
                .data(carService.createCar(id, carRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
    // tìm danh sách carvới userID
    @GetMapping("/{id}/list-car")
    public ResponseEntity<?> getAllCarByUserId(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(carService.getAllCarsByUserId(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }




}
