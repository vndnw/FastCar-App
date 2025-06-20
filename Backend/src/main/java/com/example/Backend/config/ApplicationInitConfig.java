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

            Role customerRole;
            if (roleRepository.findByName("user").isEmpty()) {
                customerRole = Role.builder()
                        .name("user")
                        .build();
                roleRepository.save(customerRole);
                log.info("ROLE 'user' has been created");
            } else {
                customerRole = roleRepository.findByName("user").get();
            }
            
            Role driverRole;
            if (roleRepository.findByName("driver").isEmpty()) {
                driverRole = Role.builder()
                        .name("driver")
                        .build();
                roleRepository.save(driverRole);
                log.info("ROLE 'driver' has been created");
            } else {
                driverRole = roleRepository.findByName("driver").get();
            }
            Role ownerRole;
            if (roleRepository.findByName("driver").isEmpty()) {
                ownerRole = Role.builder()
                        .name("driver")
                        .build();
                roleRepository.save(ownerRole);
                log.info("ROLE 'driver' has been created");
            } else {
                ownerRole = roleRepository.findByName("driver").get();
            }

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                List<Role> adminRoles = new ArrayList<>();
                adminRoles.add(adminRole);
                adminRoles.add(customerRole);
                adminRoles.add(driverRole);
                adminRoles.add(ownerRole);
                
                User admin = User.builder()
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin"))
                        .roles(adminRoles)
                        .build();
                userRepository.save(admin);
                log.info("ADMIN has been created with default password 'admin'");
            }
            
            if (userRepository.findByEmail("user@gmail.com").isEmpty()) {
                List<Role> customerRoles = new ArrayList<>();
                customerRoles.add(customerRole);
                
                User customer = User.builder()
                        .email("user@gmail.com")
                        .password(passwordEncoder.encode("customer"))
                        .roles(customerRoles)
                        .build();
                userRepository.save(customer);
                log.info("DEFAULT CUSTOMER has been created with password 'customer'");
            }

            if (userRepository.findByEmail("driver@gmail.com").isEmpty()) {
                List<Role> driverRoles = new ArrayList<>();
                driverRoles.add(driverRole);
                
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