package com.smartwaste.controller;

import com.smartwaste.dto.request.UpdateStatusDto;
import com.smartwaste.dto.response.PagedResponse;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.dto.response.WorkerStatsDto;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.security.UserPrincipal;
import com.smartwaste.service.WorkerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/worker")
@PreAuthorize("hasRole('WORKER')")
@Tag(name = "Collection Worker Tasks", description = "Endpoints for collection workers to manage assigned tasks and update status")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping("/tasks")
    @Operation(summary = "Get assigned tasks for the authenticated worker")
    public ResponseEntity<PagedResponse<PickupRequestDto>> getAssignedTasks(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PickupRequestDto> response = workerService.getAssignedTasks(principal, status, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tasks/{id}")
    @Operation(summary = "Get detailed information for a specific assigned task")
    public ResponseEntity<PickupRequestDto> getTaskById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        PickupRequestDto response = workerService.getTaskById(principal, id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/tasks/{id}/status")
    @Operation(summary = "Update task status (ACCEPTED, IN_PROGRESS, COLLECTED) with notes")
    public ResponseEntity<PickupRequestDto> updateTaskStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusDto dto) {
        PickupRequestDto response = workerService.updateTaskStatus(principal, id, dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    @Operation(summary = "Get worker's completed collection history")
    public ResponseEntity<PagedResponse<PickupRequestDto>> getTaskHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PickupRequestDto> response = workerService.getTaskHistory(principal, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get worker task counts and completion statistics")
    public ResponseEntity<WorkerStatsDto> getWorkerStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        WorkerStatsDto response = workerService.getWorkerStats(principal);
        return ResponseEntity.ok(response);
    }
}
