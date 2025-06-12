package com.example.Backend.service;

import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceCustom implements UserDetailsService {

    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    private static final String PHONE_PATTERN = "^\\+?[0-9]{8,15}$";

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user = null;

        if(username.matches(EMAIL_PATTERN)) {
            user = userRepository.findByEmail(username);
        } else if (username.matches(PHONE_PATTERN)) {
            user = userRepository.findByPhone(username);
        }else{
            throw new ResourceNotFoundException("Invalid username or phone number");
        }

        User userDetails = user.orElseThrow(() -> new UsernameNotFoundException("User not found with email(phone) : " + username));

        if(!userDetails.isActive()) {
            throw new RuntimeException("User is not active: " + username);
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(userDetails.getEmail())
                .password(userDetails.getPassword())
                .roles(userDetails.getRoles().stream()
                        .map(role -> role.getName())
                        .toArray(String[]::new))
                .build();

    }
}
