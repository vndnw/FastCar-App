package com.example.Backend.controller;


import com.example.Backend.dto.ResponseData;
import com.example.Backend.dto.request.RoleRequest;
import com.example.Backend.dto.response.RoleResponse;
import com.example.Backend.service.RoleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/role")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<?> getAllRoles() {
        ResponseData responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Success")
                .data(roleService.getAllRoles())
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody RoleRequest roleRequest) {
        log.info("Create Role: {}", roleRequest);
        ResponseData responseData = ResponseData.builder()
                .status(HttpStatus.CREATED.value())
                .message("Success")
                .data(roleService.createRole(roleRequest.getRole()))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable long id, @RequestBody RoleRequest roleRequest) {
        ResponseData responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Success")
                .data(roleService.updateRole(id, roleRequest.getRole()))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @GetMapping("/{role}")
    public ResponseEntity<?> getRoleById(@PathVariable String role) {
        ResponseData responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Success")
                .data(roleService.getRoleByName(role))
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        ResponseData responseData = ResponseData.builder()
                .status(HttpStatus.OK.value())
                .message("Role deleted successfully")
                .build();
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
