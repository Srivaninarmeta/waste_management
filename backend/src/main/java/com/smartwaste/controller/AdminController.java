package com.smartwaste.controller;

import com.smartwaste.dto.request.AssignWorkerDto;
import com.smartwaste.dto.request.CreateWorkerDto;
import com.smartwaste.dto.request.UpdateUserStatusDto;
import com.smartwaste.dto.response.DashboardStatsDto;
import com.smartwaste.dto.response.PagedResponse;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.dto.response.ReportSummaryDto;
import com.smartwaste.dto.response.UserSummaryDto;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.entity.Role;
import com.smartwaste.entity.WasteCategory;
import com.smartwaste.security.UserPrincipal;
import com.smartwaste.service.AdminService;
import com.smartwaste.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator Management", description = "Endpoints for administrators to manage operations, users, assignments, and reports")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    public AdminController(AdminService adminService, ReportService reportService) {
        this.adminService = adminService;
        this.reportService = reportService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated operational dashboard statistics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto response = adminService.getDashboardStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pickup-requests")
    @Operation(summary = "Search, filter, and paginate all pickup requests")
    public ResponseEntity<PagedResponse<PickupRequestDto>> getAllPickupRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) WasteCategory category,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PickupRequestDto> response = adminService.getAllRequests(
                status, category, locality, startDate, endDate, search, page, size
        );
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/pickup-requests/{id}/assign")
    @Operation(summary = "Assign or reassign a pickup request to a worker")
    public ResponseEntity<PickupRequestDto> assignWorker(
            @PathVariable Long id,
            @Valid @RequestBody AssignWorkerDto dto,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {
        PickupRequestDto response = adminService.assignWorker(id, dto, adminPrincipal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    @Operation(summary = "List and filter user accounts")
    public ResponseEntity<PagedResponse<UserSummaryDto>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<UserSummaryDto> response = adminService.getAllUsers(role, active, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/workers")
    @Operation(summary = "Create a new collection worker account")
    public ResponseEntity<UserSummaryDto> createWorker(@Valid @RequestBody CreateWorkerDto dto) {
        UserSummaryDto response = adminService.createWorker(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user/worker account")
    public ResponseEntity<UserSummaryDto> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusDto dto,
            @AuthenticationPrincipal UserPrincipal adminPrincipal) {
        UserSummaryDto response = adminService.updateUserStatus(id, dto, adminPrincipal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/workers/active")
    @Operation(summary = "Get list of active workers for assignment dropdowns")
    public ResponseEntity<List<UserSummaryDto>> getActiveWorkers() {
        List<UserSummaryDto> response = adminService.getActiveWorkers();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports")
    @Operation(summary = "Get collection performance analytics report")
    public ResponseEntity<ReportSummaryDto> getReports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ReportSummaryDto response = reportService.getReportSummary(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/reports/export")
    @Operation(summary = "Export filtered pickup records to CSV")
    public ResponseEntity<byte[]> exportToCsv(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) WasteCategory category,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        byte[] csvData = reportService.exportRequestsToCsv(status, category, locality, startDate, endDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pickup-requests-report.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }
}
