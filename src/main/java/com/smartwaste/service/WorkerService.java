package com.smartwaste.service;

import com.smartwaste.dto.request.UpdateStatusDto;
import com.smartwaste.dto.response.PagedResponse;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.dto.response.WorkerStatsDto;
import com.smartwaste.entity.PickupRequest;
import com.smartwaste.entity.PickupStatusHistory;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.entity.User;
import com.smartwaste.exception.BadRequestException;
import com.smartwaste.exception.InvalidStatusTransitionException;
import com.smartwaste.exception.ResourceNotFoundException;
import com.smartwaste.exception.UnauthorizedException;
import com.smartwaste.repository.PickupRequestRepository;
import com.smartwaste.repository.PickupStatusHistoryRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerService {

    private final PickupRequestRepository pickupRequestRepository;
    private final PickupStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;

    public WorkerService(PickupRequestRepository pickupRequestRepository,
                         PickupStatusHistoryRepository statusHistoryRepository,
                         UserRepository userRepository) {
        this.pickupRequestRepository = pickupRequestRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<PickupRequestDto> getAssignedTasks(UserPrincipal principal, RequestStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("preferredPickupDate").ascending().and(Sort.by("createdAt").descending()));
        Page<PickupRequest> pageResult;

        if (status != null) {
            pageResult = pickupRequestRepository.findByAssignedWorkerIdAndStatus(principal.getId(), status, pageable);
        } else {
            // Default to active non-terminal tasks
            List<RequestStatus> activeStatuses = Arrays.asList(RequestStatus.ASSIGNED, RequestStatus.ACCEPTED, RequestStatus.IN_PROGRESS);
            pageResult = pickupRequestRepository.findByAssignedWorkerIdAndStatusIn(principal.getId(), activeStatuses, pageable);
        }

        List<PickupRequestDto> content = pageResult.getContent().stream()
                .map(PickupRequestDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages(), pageResult.isLast());
    }

    @Transactional(readOnly = true)
    public PickupRequestDto getTaskById(UserPrincipal principal, Long taskId) {
        PickupRequest request = pickupRequestRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (request.getAssignedWorker() == null || !request.getAssignedWorker().getId().equals(principal.getId())) {
            throw new UnauthorizedException("This task is not assigned to you");
        }

        return PickupRequestDto.fromEntity(request);
    }

    @Transactional
    public PickupRequestDto updateTaskStatus(UserPrincipal principal, Long taskId, UpdateStatusDto dto) {
        PickupRequest request = pickupRequestRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (request.getAssignedWorker() == null || !request.getAssignedWorker().getId().equals(principal.getId())) {
            throw new UnauthorizedException("This task is not assigned to you");
        }

        RequestStatus currentStatus = request.getStatus();
        RequestStatus targetStatus = dto.getStatus();

        // Validate allowed worker transitions
        boolean isValidTransition = switch (currentStatus) {
            case ASSIGNED -> targetStatus == RequestStatus.ACCEPTED;
            case ACCEPTED -> targetStatus == RequestStatus.IN_PROGRESS;
            case IN_PROGRESS -> targetStatus == RequestStatus.COLLECTED;
            default -> false;
        };

        if (!isValidTransition) {
            throw new InvalidStatusTransitionException(
                    "Invalid status transition from " + currentStatus.name() + " to " + targetStatus.name() + " by worker"
            );
        }

        request.setStatus(targetStatus);

        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            if (request.getWorkerNotes() == null || request.getWorkerNotes().isBlank()) {
                request.setWorkerNotes(dto.getNotes().trim());
            } else {
                request.setWorkerNotes(request.getWorkerNotes() + " | " + dto.getNotes().trim());
            }
        }

        if (targetStatus == RequestStatus.COLLECTED) {
            request.setCollectedAt(LocalDateTime.now());
        }

        User worker = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

        PickupStatusHistory history = new PickupStatusHistory(
                request,
                currentStatus.name(),
                targetStatus.name(),
                worker,
                dto.getNotes() != null && !dto.getNotes().isBlank() ? dto.getNotes().trim() : "Status updated to " + targetStatus.name()
        );
        statusHistoryRepository.save(history);
        request.getStatusHistories().add(history);

        PickupRequest saved = pickupRequestRepository.save(request);
        return PickupRequestDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PickupRequestDto> getTaskHistory(UserPrincipal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("collectedAt").descending().and(Sort.by("updatedAt").descending()));
        Page<PickupRequest> pageResult = pickupRequestRepository.findByAssignedWorkerIdAndStatus(
                principal.getId(), RequestStatus.COLLECTED, pageable
        );

        List<PickupRequestDto> content = pageResult.getContent().stream()
                .map(PickupRequestDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages(), pageResult.isLast());
    }

    @Transactional(readOnly = true)
    public WorkerStatsDto getWorkerStats(UserPrincipal principal) {
        long totalAssigned = pickupRequestRepository.countByAssignedWorkerId(principal.getId());
        long pending = pickupRequestRepository.countByAssignedWorkerIdAndStatus(principal.getId(), RequestStatus.ASSIGNED);
        long accepted = pickupRequestRepository.countByAssignedWorkerIdAndStatus(principal.getId(), RequestStatus.ACCEPTED);
        long inProgress = pickupRequestRepository.countByAssignedWorkerIdAndStatus(principal.getId(), RequestStatus.IN_PROGRESS);
        long completed = pickupRequestRepository.countByAssignedWorkerIdAndStatus(principal.getId(), RequestStatus.COLLECTED);

        return new WorkerStatsDto(totalAssigned, pending, (accepted + inProgress), completed);
    }
}
