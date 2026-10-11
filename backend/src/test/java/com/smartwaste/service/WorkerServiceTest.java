package com.smartwaste.service;

import com.smartwaste.dto.request.UpdateStatusDto;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.entity.PickupRequest;
import com.smartwaste.entity.PickupStatusHistory;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.entity.Role;
import com.smartwaste.entity.User;
import com.smartwaste.exception.InvalidStatusTransitionException;
import com.smartwaste.exception.UnauthorizedException;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkerServiceTest {

    @Mock
    private PickupRequestRepository pickupRequestRepository;

    @Mock
    private PickupStatusHistoryRepository statusHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WorkerService workerService;

    private User worker1;
    private User worker2;
    private UserPrincipal worker1Principal;

    @BeforeEach
    void setUp() {
        worker1 = new User("David Miller", "worker1@test.com", "hash", "1112223333", "12 Yard", "North", Role.WORKER);
        worker1.setId(10L);

        worker2 = new User("Sarah Connor", "worker2@test.com", "hash", "4445556666", "34 Depot", "South", Role.WORKER);
        worker2.setId(20L);

        worker1Principal = UserPrincipal.create(worker1);
    }

    @Test
    void testUpdateStatus_ValidTransition_AssignedToAccepted() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setAssignedWorker(worker1);
        request.setStatus(RequestStatus.ASSIGNED);

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(userRepository.findById(10L)).thenReturn(Optional.of(worker1));
        when(pickupRequestRepository.save(any(PickupRequest.class))).thenAnswer(i -> i.getArgument(0));

        UpdateStatusDto dto = new UpdateStatusDto(RequestStatus.ACCEPTED, "Task accepted by worker");
        PickupRequestDto result = workerService.updateTaskStatus(worker1Principal, 100L, dto);

        assertEquals(RequestStatus.ACCEPTED, result.getStatus());
        verify(statusHistoryRepository).save(any(PickupStatusHistory.class));
    }

    @Test
    void testUpdateStatus_ValidTransition_InProgressToCollected() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setAssignedWorker(worker1);
        request.setStatus(RequestStatus.IN_PROGRESS);

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));
        when(userRepository.findById(10L)).thenReturn(Optional.of(worker1));
        when(pickupRequestRepository.save(any(PickupRequest.class))).thenAnswer(i -> i.getArgument(0));

        UpdateStatusDto dto = new UpdateStatusDto(RequestStatus.COLLECTED, "Waste collected and loaded onto truck");
        PickupRequestDto result = workerService.updateTaskStatus(worker1Principal, 100L, dto);

        assertEquals(RequestStatus.COLLECTED, result.getStatus());
        assertNotNull(result.getCollectedAt());
    }

    @Test
    void testUpdateStatus_InvalidSkippedTransition_ThrowsException() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setAssignedWorker(worker1);
        request.setStatus(RequestStatus.ASSIGNED); // Cannot jump straight to COLLECTED

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));

        UpdateStatusDto dto = new UpdateStatusDto(RequestStatus.COLLECTED, "Skipping straight to collected");
        assertThrows(InvalidStatusTransitionException.class, () -> {
            workerService.updateTaskStatus(worker1Principal, 100L, dto);
        });
    }

    @Test
    void testUpdateStatus_UnassignedWorker_ThrowsUnauthorizedException() {
        PickupRequest request = new PickupRequest();
        request.setId(100L);
        request.setAssignedWorker(worker2); // Assigned to Sarah, but David is caller
        request.setStatus(RequestStatus.ASSIGNED);

        when(pickupRequestRepository.findById(100L)).thenReturn(Optional.of(request));

        UpdateStatusDto dto = new UpdateStatusDto(RequestStatus.ACCEPTED, "Trying to accept");
        assertThrows(UnauthorizedException.class, () -> {
            workerService.updateTaskStatus(worker1Principal, 100L, dto);
        });
    }
}
