package com.example.Backend.controller;

import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.CarFirstCreateRequest;
import com.example.Backend.dto.request.UserRequest;
import com.example.Backend.service.CarService;
import com.example.Backend.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final CarService carService;

    public UserController(UserService userService, CarService carService) {
        this.userService = userService;
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(Pageable pageable) {
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
                .message("Success")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    // khởi tạo kí gửi xe với các thông tin basic  của car sau đó sẽ update thông tin sau
    @PostMapping("/{id}/depositor")
    public ResponseEntity<?> depositCar(@PathVariable long id, @RequestBody CarFirstCreateRequest carFirstCreateRequest) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(201)
                .message("Car added successfully")
                .data(carService.createCarBasic(id, carFirstCreateRequest))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }

    // tìm danh sách carvới userID
    @GetMapping("/{id}/car")
    public ResponseEntity<?> getAllCarByUserId(@PathVariable long id) {
        ResponseData<?> responseData = ResponseData.builder()
                .status(200)
                .message("Success")
                .data(carService.getAllCarsByUserId(id))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }




}
