package com.smartwaste.service;

import com.smartwaste.dto.request.CreatePickupRequestDto;
import com.smartwaste.dto.request.UpdatePickupRequestDto;
import com.smartwaste.dto.response.PagedResponse;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.entity.*;
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

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PickupRequestService {

    private final PickupRequestRepository pickupRequestRepository;
    private final PickupStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    public PickupRequestService(PickupRequestRepository pickupRequestRepository,
                                PickupStatusHistoryRepository statusHistoryRepository,
                                UserRepository userRepository) {
        this.pickupRequestRepository = pickupRequestRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.userRepository = userRepository;
    }

    private String generateRequestNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        int randomPart = 1000 + RANDOM.nextInt(9000);
        return "REQ-" + datePart + "-" + randomPart;
    }

    @Transactional
    public PickupRequestDto createRequest(UserPrincipal principal, CreatePickupRequestDto dto) {
        User resident = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident not found with id: " + principal.getId()));

        if (!Boolean.TRUE.equals(resident.getActive())) {
            throw new UnauthorizedException("Your account is inactive. Please contact support.");
        }

        PickupRequest request = new PickupRequest();
        request.setRequestNumber(generateRequestNumber());
        request.setResident(resident);
        request.setWasteCategory(dto.getWasteCategory());
        request.setDescription(dto.getDescription());
        request.setPickupAddress(dto.getPickupAddress().trim());
        request.setLocality(dto.getLocality().trim());
        request.setPreferredPickupDate(dto.getPreferredPickupDate());
        request.setResidentInstructions(dto.getResidentInstructions());
        request.setStatus(RequestStatus.PENDING);

        PickupRequest savedRequest = pickupRequestRepository.save(request);

        // Record initial status history
        PickupStatusHistory history = new PickupStatusHistory(
                savedRequest,
                null,
                RequestStatus.PENDING.name(),
                resident,
                "Pickup request submitted by resident"
        );
        statusHistoryRepository.save(history);
        savedRequest.getStatusHistories().add(history);

        return PickupRequestDto.fromEntity(savedRequest);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PickupRequestDto> getMyRequests(UserPrincipal principal, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PickupRequest> pageResult = pickupRequestRepository.findByResidentId(principal.getId(), pageable);

        List<PickupRequestDto> content = pageResult.getContent().stream()
                .map(PickupRequestDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, pageResult.getNumber(), pageResult.getSize(),
                pageResult.getTotalElements(), pageResult.getTotalPages(), pageResult.isLast());
    }

    @Transactional(readOnly = true)
    public PickupRequestDto getRequestById(UserPrincipal principal, Long id) {
        PickupRequest request = pickupRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with id: " + id));

        // Enforce data isolation: only the request owner, assigned worker, or admin can view
        boolean isOwner = request.getResident().getId().equals(principal.getId());
        boolean isAssignedWorker = request.getAssignedWorker() != null && request.getAssignedWorker().getId().equals(principal.getId());
        boolean isAdmin = principal.getRole() == Role.ADMIN;

        if (!isOwner && !isAssignedWorker && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to view this request");
        }

        return PickupRequestDto.fromEntity(request);
    }

    @Transactional
    public PickupRequestDto updateRequest(UserPrincipal principal, Long id, UpdatePickupRequestDto dto) {
        PickupRequest request = pickupRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with id: " + id));

        if (!request.getResident().getId().equals(principal.getId())) {
            throw new UnauthorizedException("You are not authorized to edit this request");
        }

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request cannot be edited once it has been " + request.getStatus().name());
        }

        request.setWasteCategory(dto.getWasteCategory());
        request.setDescription(dto.getDescription());
        request.setPickupAddress(dto.getPickupAddress().trim());
        request.setLocality(dto.getLocality().trim());
        request.setPreferredPickupDate(dto.getPreferredPickupDate());
        request.setResidentInstructions(dto.getResidentInstructions());

        PickupRequest saved = pickupRequestRepository.save(request);
        return PickupRequestDto.fromEntity(saved);
    }

    @Transactional
    public PickupRequestDto cancelRequest(UserPrincipal principal, Long id) {
        PickupRequest request = pickupRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup request not found with id: " + id));

        if (!request.getResident().getId().equals(principal.getId())) {
            throw new UnauthorizedException("You are not authorized to cancel this request");
        }

        if (request.getStatus() == RequestStatus.IN_PROGRESS || request.getStatus() == RequestStatus.COLLECTED) {
            throw new InvalidStatusTransitionException("Cannot cancel request because collection is already " + request.getStatus().name());
        }

        if (request.getStatus() == RequestStatus.CANCELLED) {
            throw new BadRequestException("Request is already cancelled");
        }

        RequestStatus previousStatus = request.getStatus();
        request.setStatus(RequestStatus.CANCELLED);

        User resident = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PickupStatusHistory history = new PickupStatusHistory(
                request,
                previousStatus.name(),
                RequestStatus.CANCELLED.name(),
                resident,
                "Request cancelled by resident"
        );
        statusHistoryRepository.save(history);
        request.getStatusHistories().add(history);

        PickupRequest saved = pickupRequestRepository.save(request);
        return PickupRequestDto.fromEntity(saved);
    }
}
