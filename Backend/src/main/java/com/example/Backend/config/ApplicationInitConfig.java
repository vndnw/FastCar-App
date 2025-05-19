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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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
            
            Role driveRole;
            if (roleRepository.findByName("drive").isEmpty()) {
                driveRole = Role.builder()
                        .name("drive")
                        .build();
                roleRepository.save(driveRole);
                log.info("ROLE 'drive' has been created");
            } else {
                driveRole = roleRepository.findByName("drive").get();
            }

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                List<Role> adminRoles = new ArrayList<>();
                adminRoles.add(adminRole);
                adminRoles.add(userRole);
                adminRoles.add(driveRole);
                
                User user = User.builder()
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin"))
                        .roles(adminRoles)
                        .build();
                userRepository.save(user);
                log.info("ADMIN has been created with default password 'admin'");
            }
            
            if (userRepository.findByEmail("user@gmail.com").isEmpty()) {
                List<Role> userRoles = new ArrayList<>();
                userRoles.add(userRole);
                
                User user = User.builder()
                        .email("user@gmail.com")
                        .password(passwordEncoder.encode("user"))
                        .roles(userRoles)
                        .build();
                userRepository.save(user);
                log.info("DEFAULT USER has been created with password 'user'");
            }

            if (userRepository.findByEmail("driver@gmail.com").isEmpty()) {
                List<Role> driverRoles = new ArrayList<>();
                driverRoles.add(driveRole);
                
                User driver = User.builder()
                        .email("driver@gmail.com")
                        .password(passwordEncoder.encode("driver"))
                        .roles(driverRoles)
                        .build();
                userRepository.save(driver);
                log.info("DEFAULT DRIVER has been created with password 'driver'");
            }
        };
    }
}