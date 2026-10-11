package com.smartwaste.service;

import com.smartwaste.dto.request.LoginRequest;
import com.smartwaste.dto.request.RegisterRequest;
import com.smartwaste.dto.request.UpdateProfileDto;
import com.smartwaste.dto.response.AuthResponse;
import com.smartwaste.dto.response.UserSummaryDto;
import com.smartwaste.entity.Role;
import com.smartwaste.entity.User;
import com.smartwaste.exception.BadRequestException;
import com.smartwaste.exception.ResourceNotFoundException;
import com.smartwaste.exception.UnauthorizedException;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.security.JwtTokenProvider;
import com.smartwaste.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse registerResident(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User(
                request.getFullName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getPhone().trim(),
                request.getAddress().trim(),
                request.getLocality().trim(),
                Role.RESIDENT // Enforce RESIDENT role strictly
        );

        User savedUser = userRepository.save(user);

        // Authenticate new user automatically
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, UserSummaryDto.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact support.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        return new AuthResponse(token, UserSummaryDto.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));
        return UserSummaryDto.fromEntity(user);
    }

    @Transactional
    public UserSummaryDto updateProfile(UserPrincipal principal, UpdateProfileDto dto) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));

        user.setFullName(dto.getFullName().trim());
        user.setPhone(dto.getPhone().trim());
        user.setAddress(dto.getAddress().trim());
        user.setLocality(dto.getLocality().trim());

        User updatedUser = userRepository.save(user);
        return UserSummaryDto.fromEntity(updatedUser);
    }
}
