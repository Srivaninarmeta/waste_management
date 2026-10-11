package com.smartwaste.service;

import com.smartwaste.dto.request.AssignWorkerDto;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.entity.*;
import com.smartwaste.exception.BadRequestException;
import com.smartwaste.exception.InvalidStatusTransitionException;
import com.smartwaste.repository.PickupRequestRepository;
import com.smartwaste.repository.PickupStatusHistoryRepository;
import com.smartwaste.repository.UserRepository;
import com.smartwaste.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PickupRequestRepository pickupRequestRepository;

    @Mock
    private PickupStatusHistoryRepository statusHistoryRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminService adminService;

    private User admin;
    private User worker;
    private User resident;
    private UserPrincipal adminPrincipal;

    @BeforeEach
    void setUp() {
        admin = new User("Admin", "admin@test.com", "hash", "0000000000", "City Hall", "Downtown", Role.ADMIN);
        admin.setId(1L);
        adminPrincipal = UserPrincipal.create(admin);

        worker = new User("David Miller", "worker@test.com", "hash", "1112223333", "12 Yard", "North", Role.WORKER);
        worker.setId(10L);
        worker.setActive(true);

        resident = new User("Alice Green", "alice@test.com", "hash", "1234567890", "123 Green St", "Downtown", Role.RESIDENT);
        resident.setId(20L);
    }

    @Test
    void testAssignWorker_Success() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setStatus(RequestStatus.PENDING);
        request.setResident(resident);

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(userRepository.findById(10L)).thenReturn(Optional.of(worker));
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(pickupRequestRepository.save(any(PickupRequest.class))).thenAnswer(i -> i.getArgument(0));

        AssignWorkerDto dto = new AssignWorkerDto(10L, "Urgent pickup priority");
        PickupRequestDto result = adminService.assignWorker(100L, dto, adminPrincipal);

        assertEquals(RequestStatus.ASSIGNED, result.getStatus());
        assertEquals(10L, result.getAssignedWorker().getId());
        verify(statusHistoryRepository).save(any(PickupStatusHistory.class));
    }

    @Test
    void testAssignWorker_InactiveWorker_ThrowsBadRequestException() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setStatus(RequestStatus.PENDING);

        worker.setActive(false); // Inactive worker

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(userRepository.findById(10L)).thenReturn(Optional.of(worker));

        AssignWorkerDto dto = new AssignWorkerDto(10L, "Assignment");
        assertThrows(BadRequestException.class, () -> {
            adminService.assignWorker(100L, dto, adminPrincipal);
        });
    }

    @Test
    void testAssignWorker_UserIsNotWorker_ThrowsBadRequestException() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setStatus(RequestStatus.PENDING);

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(userRepository.findById(20L)).thenReturn(Optional.of(resident)); // resident, not worker

        AssignWorkerDto dto = new AssignWorkerDto(20L, "Assignment");
        assertThrows(BadRequestException.class, () -> {
            adminService.assignWorker(100L, dto, adminPrincipal);
        });
    }

    @Test
    void testAssignWorker_AlreadyCollected_ThrowsInvalidStatusTransitionException() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setStatus(RequestStatus.COLLECTED);

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));

        AssignWorkerDto dto = new AssignWorkerDto(10L, "Assignment");
        assertThrows(InvalidStatusTransitionException.class, () -> {
            adminService.assignWorker(100L, dto, adminPrincipal);
        });
    }
}
