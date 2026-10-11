package com.smartwaste.controller;

import com.smartwaste.dto.request.CreatePickupRequestDto;
import com.smartwaste.dto.request.UpdatePickupRequestDto;
import com.smartwaste.dto.response.PagedResponse;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.security.UserPrincipal;
import com.smartwaste.service.PickupRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pickup-requests")
@Tag(name = "Resident Pickup Requests", description = "Endpoints for creating, managing, and tracking waste pickups")
public class PickupRequestController {

    private final PickupRequestService pickupRequestService;

    public PickupRequestController(PickupRequestService pickupRequestService) {
        this.pickupRequestService = pickupRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Submit a new waste pickup request")
    public ResponseEntity<PickupRequestDto> createRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePickupRequestDto dto) {
        PickupRequestDto response = pickupRequestService.createRequest(principal, dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Get list of personal pickup requests for authenticated resident")
    public ResponseEntity<PagedResponse<PickupRequestDto>> getMyRequests(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PickupRequestDto> response = pickupRequestService.getMyRequests(principal, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get request details and status timeline")
    public ResponseEntity<PickupRequestDto> getRequestById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        PickupRequestDto response = pickupRequestService.getRequestById(principal, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Edit an existing pending pickup request")
    public ResponseEntity<PickupRequestDto> updateRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePickupRequestDto dto) {
        PickupRequestDto response = pickupRequestService.updateRequest(principal, id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('RESIDENT')")
    @Operation(summary = "Cancel an uncollected pickup request")
    public ResponseEntity<PickupRequestDto> cancelRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        PickupRequestDto response = pickupRequestService.cancelRequest(principal, id);
        return ResponseEntity.ok(response);
    }
}
