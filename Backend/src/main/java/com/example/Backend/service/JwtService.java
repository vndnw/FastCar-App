package com.example.Backend.service;

import com.example.Backend.model.RefreshToken;
import com.example.Backend.model.enums.TokenType;
import com.example.Backend.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JwtService {
    @Value("${jwt.secretKey.access}")
    private String SECRETKEY_ACCESS;
    @Value("${jwt.secretKey.refresh}")
    private String SECRETKEY_REFRESH;
    @Value("${jwt.issuer}")
    private String ISSUER;
    @Value("${jwt.expiration.access}")
    private long EXPIRATION_ACCESS;
    @Value("${jwt.expiration.refresh}")
    private long EXPIRATION_REFRESH;

    public final RefreshTokenRepository refreshTokenRepository;

    public JwtService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public String generateToken(UserDetails userDetails, TokenType tokenType, String idToken) {

        log.info("Roles: {}", getRole(userDetails));

        String token = Jwts.builder()
                .id(idToken)
                .claim("roles", getRole(userDetails))
                .subject(userDetails.getUsername())
                .issuer(ISSUER)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + getExpiration(tokenType)))
                .signWith(getSigningKey(tokenType))
                .compact();
        if(tokenType.equals(TokenType.REFRESH_TOKEN)){
            RefreshToken refreshToken = RefreshToken.builder()
                    .id(idToken)
                    .token(token)
                    .createdAt(LocalDateTime.now())
                    .build();
            refreshTokenRepository.save(refreshToken);
        }
        return token;
    }

    public Claims extractAllClaims(String token, TokenType tokenType) {
        return Jwts.parser()
                .verifyWith(getSigningKey(tokenType))
                .requireIssuer(ISSUER)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getRole(@NotNull UserDetails userDetails) {
        return userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
    }

    public List<String> extractRoles(String token, TokenType tokenType) {
        Claims claims = extractAllClaims(token, tokenType);
        String roles = claims.get("roles", String.class);
        return Arrays.asList(roles.split(","));
    }

    public long getExpiration(@NotNull TokenType tokenType) {
        return tokenType.equals(TokenType.ACCESS_TOKEN) ? EXPIRATION_ACCESS : EXPIRATION_REFRESH;
    }

    public SecretKey getSigningKey(@NotNull TokenType tokenType) {
        return tokenType.equals(TokenType.ACCESS_TOKEN) ? Keys.hmacShaKeyFor(SECRETKEY_ACCESS.getBytes()) : Keys.hmacShaKeyFor(SECRETKEY_REFRESH.getBytes());
    }

    public String extractEmail(String token, TokenType tokenType) {
        return extractAllClaims(token, tokenType).getSubject();
    }

    public String extractId(String token, TokenType tokenType) {
        return extractAllClaims(token, tokenType).getId();
    }

    public boolean validateToken(String token, @NotNull UserDetails userDetails) {
        String username = extractEmail(token, TokenType.ACCESS_TOKEN);
        return (username.equals(userDetails.getUsername()) && !isExpiration(token, TokenType.ACCESS_TOKEN));
    }

    public boolean isExpiration(String token, TokenType tokenType) {
        Claims claims = extractAllClaims(token, tokenType);
        Date expirationDate = claims.getExpiration();
        return expirationDate.before(new Date());
    }

    public boolean isTokenExpired(String refreshToken) {
        Claims claims = extractAllClaims(refreshToken, TokenType.REFRESH_TOKEN);
        Date expirationDate = claims.getExpiration();
        return expirationDate.before(new Date());
    }
}
