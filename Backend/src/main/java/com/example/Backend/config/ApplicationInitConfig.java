package com.example.Backend.config;

import com.example.Backend.model.Role;
import com.example.Backend.model.User;
import com.example.Backend.repository.RoleRepository;
import com.example.Backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            // Tạo role "admin" nếu chưa tồn tại
            Role adminRole;
            if (roleRepository.findByName("admin").isEmpty()) {
                adminRole = Role.builder()
                        .name("admin")
                        .build();
                roleRepository.save(adminRole);
                log.info("ROLE 'admin' has been created");
            } else {
                adminRole = roleRepository.findByName("admin").get();
            }
            
            // Tạo role "user" nếu chưa tồn tại
            Role userRole;
            if (roleRepository.findByName("user").isEmpty()) {
                userRole = Role.builder()
                        .name("user")
                        .build();
                roleRepository.save(userRole);
                log.info("ROLE 'user' has been created");
            } else {
                userRole = roleRepository.findByName("user").get();
            }

            // Tạo admin mặc định nếu chưa tồn tại
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                // Tạo set roles cho admin (có cả admin và user role)
                Set<Role> adminRoles = new HashSet<>();
                adminRoles.add(adminRole);
                adminRoles.add(userRole);
                
                User user = User.builder()
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin"))
                        .roles(adminRoles) // Sử dụng set roles thay vì một role
                        .build();
                userRepository.save(user);
                log.info("ADMIN has been created with default password 'admin'");
            }
            
            // Tạo user mặc định nếu chưa tồn tại
            if (userRepository.findByEmail("user@gmail.com").isEmpty()) {
                // User chỉ có user role
                Set<Role> userRoles = new HashSet<>();
                userRoles.add(userRole);
                
                User user = User.builder()
                        .email("user@gmail.com")
                        .password(passwordEncoder.encode("user123"))
                        .roles(userRoles) // Assign role set cho user
                        .build();
                userRepository.save(user);
                log.info("DEFAULT USER has been created with password 'user123'");
            }
        };
    }
}