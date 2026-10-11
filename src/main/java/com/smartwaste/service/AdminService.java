package com.smartwaste.service;

import com.smartwaste.dto.request.AssignWorkerDto;
import com.smartwaste.dto.request.CreateWorkerDto;
import com.smartwaste.dto.request.UpdateUserStatusDto;
import com.smartwaste.dto.response.DashboardStatsDto;
import com.smartwaste.dto.response.PagedResponse;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.dto.response.UserSummaryDto;
import com.smartwaste.entity.*;
import com.smartwaste.exception.BadRequestException;
import com.smartwaste.exception.InvalidStatusTransitionException;
import com.smartwaste.exception.ResourceNotFoundException;
import com.smartwaste.repository.PickupRequestRepository;
import com.smartwaste.repository.PickupStatusHistoryRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final PickupStatusHistoryRepository statusHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        PickupRequestRepository pickupRequestRepository,
                        PickupStatusHistoryRepository statusHistoryRepository,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalResidents = userRepository.countByRole(Role.RESIDENT);
        long totalActiveWorkers = userRepository.countByRoleAndActive(Role.WORKER, true);
        long totalWorkers = userRepository.countByRole(Role.WORKER);
        long totalPickupRequests = pickupRequestRepository.count();
        long pending = pickupRequestRepository.countByStatus(RequestStatus.PENDING);
        long assigned = pickupRequestRepository.countByStatus(RequestStatus.ASSIGNED);
        long accepted = pickupRequestRepository.countByStatus(RequestStatus.ACCEPTED);
        long inProgress = pickupRequestRepository.countByStatus(RequestStatus.IN_PROGRESS);
        long completed = pickupRequestRepository.countByStatus(RequestStatus.COLLECTED);
        long cancelled = pickupRequestRepository.countByStatus(RequestStatus.CANCELLED);

        return new DashboardStatsDto(
                totalResidents,
                totalActiveWorkers,
                totalWorkers,
                totalPickupRequests,
                pending,
                assigned,
                (accepted + inProgress),
                completed,
                cancelled
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<PickupRequestDto> getAllRequests(
            RequestStatus status,
            WasteCategory category,
            String locality,
            LocalDate startDate,
            LocalDate endDate,
            String search,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PickupRequest> pageResult = pickupRequestRepository.filterRequests(
                status, category, locality, startDate, endDate, search, pageable
        );

        List<PickupRequestDto> content = pageResult.getContent().stream()
                .map(PickupRequestDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages(), pageResult.isLast());
    }

    @Transactional
    public PickupRequestDto assignWorker(Long requestId, AssignWorkerDto dto, UserPrincipal adminPrincipal) {
        PickupRequest request = pickupRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with id: " + requestId));

        if (request.getStatus() == RequestStatus.COLLECTED) {
            throw new InvalidStatusTransitionException("Cannot assign worker to an already collected request");
        }
        if (request.getStatus() == RequestStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Cannot assign worker to a cancelled request");
        }

        User worker = userRepository.findById(dto.getWorkerId())
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found with id: " + dto.getWorkerId()));

        if (worker.getRole() != Role.WORKER) {
            throw new BadRequestException("Assigned user must be a collection worker");
        }
        if (!Boolean.TRUE.equals(worker.getActive())) {
            throw new BadRequestException("Cannot assign inactive worker: " + worker.getFullName());
        }

        RequestStatus previousStatus = request.getStatus();
        request.setAssignedWorker(worker);
        request.setStatus(RequestStatus.ASSIGNED);
        request.setAssignedAt(LocalDateTime.now());

        User admin = userRepository.findById(adminPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        String note = "Assigned to worker: " + worker.getFullName();
        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            note += " (" + dto.getNotes().trim() + ")";
        }

        PickupStatusHistory history = new PickupStatusHistory(
                request,
                previousStatus.name(),
                RequestStatus.ASSIGNED.name(),
                admin,
                note
        );
        statusHistoryRepository.save(history);
        request.getStatusHistories().add(history);

        PickupRequest saved = pickupRequestRepository.save(request);
        return PickupRequestDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserSummaryDto> getAllUsers(Role role, Boolean active, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> pageResult;

        if (role != null) {
            pageResult = userRepository.findAllByRole(role, pageable);
        } else {
            pageResult = userRepository.findAll(pageable);
        }

        List<UserSummaryDto> content = pageResult.getContent().stream()
                .filter(u -> active == null || u.getActive().equals(active))
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages(), pageResult.isLast());
    }

    @Transactional
    public UserSummaryDto createWorker(CreateWorkerDto dto) {
        String email = dto.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("A user with this email already exists");
        }

        User worker = new User(
                dto.getFullName().trim(),
                email,
                passwordEncoder.encode(dto.getPassword()),
                dto.getPhone().trim(),
                dto.getAddress().trim(),
                dto.getLocality().trim(),
                Role.WORKER
        );

        User saved = userRepository.save(worker);
        return UserSummaryDto.fromEntity(saved);
    }

    @Transactional
    public UserSummaryDto updateUserStatus(Long userId, UpdateUserStatusDto dto, UserPrincipal adminPrincipal) {
        if (userId.equals(adminPrincipal.getId())) {
            throw new BadRequestException("Administrators cannot alter their own active status");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setActive(dto.getActive());
        User saved = userRepository.save(user);
        return UserSummaryDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getActiveWorkers() {
        return userRepository.findAllByRoleAndActive(Role.WORKER, true).stream()
                .map(UserSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }
}
