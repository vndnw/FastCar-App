package com.example.Backend.config;

import com.example.Backend.model.enums.TokenType;
import com.example.Backend.service.BlackListService;
import com.example.Backend.service.JwtService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final BlackListService blackListService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService,BlackListService blackListService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.blackListService = blackListService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("---------------------------JWT_AUTHENTICATION_FILTER---------------------------------------");
        String authHeader = request.getHeader("Authorization");

        if (StringUtils.isBlank(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwtToken = authHeader.substring(7);

        log.info("JWT Token: {}", jwtToken);

        if (blackListService.isTokenBlacklisted(jwtToken)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is blacklisted");
            return;
        }

        String userEmail = jwtService.extractEmail(jwtToken, TokenType.ACCESS_TOKEN);

        if (userEmail == null) {
            log.warn("Invalid JWT token: unable to extract email");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token");
            return;
        }

        if(SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.validateToken(jwtToken, userDetails)) {

                String idToken  = jwtService.extractId(jwtToken, TokenType.ACCESS_TOKEN);

                List<String> role = jwtService.extractRoles(jwtToken, TokenType.ACCESS_TOKEN);

                List<SimpleGrantedAuthority> authorities = role.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                authentication.setDetails(idToken);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.info("JWT token validated successfully for user(email): {}", userEmail);

                filterChain.doFilter(request, response);
            }else {
                log.warn("JWT token validation failed for user: {}", userEmail);
            }
        }
    }


}
