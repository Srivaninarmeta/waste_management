package com.smartwaste.controller;

import com.smartwaste.dto.request.LoginRequest;
import com.smartwaste.dto.request.RegisterRequest;
import com.smartwaste.dto.request.UpdateProfileDto;
import com.smartwaste.dto.response.AuthResponse;
import com.smartwaste.dto.response.UserSummaryDto;
import com.smartwaste.security.UserPrincipal;
import com.smartwaste.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication & User Profile", description = "Endpoints for registration, login, and profile management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new Resident account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerResident(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Log in with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "Retrieve current authenticated user details")
    public ResponseEntity<UserSummaryDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserSummaryDto response = authService.getCurrentUser(principal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update authenticated user's profile")
    public ResponseEntity<UserSummaryDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileDto dto) {
        UserSummaryDto response = authService.updateProfile(principal, dto);
        return ResponseEntity.ok(response);
    }
}
