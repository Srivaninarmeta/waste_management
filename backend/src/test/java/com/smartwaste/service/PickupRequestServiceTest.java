package com.smartwaste.service;

import com.smartwaste.dto.request.CreatePickupRequestDto;
import com.smartwaste.dto.request.UpdatePickupRequestDto;
import com.smartwaste.dto.response.PickupRequestDto;
import com.smartwaste.entity.*;
import com.smartwaste.exception.BadRequestException;
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

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PickupRequestServiceTest {

    @Mock
    private PickupRequestRepository pickupRequestRepository;

    @Mock
    private PickupStatusHistoryRepository statusHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PickupRequestService pickupRequestService;

    private User resident1;
    private User resident2;
    private UserPrincipal resident1Principal;
    private UserPrincipal resident2Principal;

    @BeforeEach
    void setUp() {
        resident1 = new User("Alice Green", "alice@test.com", "hash", "1234567890", "123 Green St", "Downtown", Role.RESIDENT);
        resident1.setId(1L);

        resident2 = new User("Bob White", "bob@test.com", "hash", "0987654321", "456 White St", "North Sector", Role.RESIDENT);
        resident2.setId(2L);

        resident1Principal = UserPrincipal.create(resident1);
        resident2Principal = UserPrincipal.create(resident2);
    }

    @Test
    void testCreateRequest_Success() {
        CreatePickupRequestDto dto = new CreatePickupRequestDto();
        dto.setWasteCategory(WasteCategory.GENERAL);
        dto.setDescription("Old sofa");
        dto.setPickupAddress("123 Green St");
        dto.setLocality("Downtown");
        dto.setPreferredPickupDate(LocalDate.now().plusDays(1));

        when(userRepository.findById(1L)).thenReturn(Optional.of(resident1));
        when(pickupRequestRepository.save(any(PickupRequest.class))).thenAnswer(invocation -> {
            PickupRequest req = invocation.getArgument(0);
            req.setId(10L);
            return req;
        });

        PickupRequestDto result = pickupRequestService.createRequest(resident1Principal, dto);

        assertNotNull(result);
        assertEquals(RequestStatus.PENDING, result.getStatus());
        assertTrue(result.getRequestNumber().startsWith("REQ-"));
        assertEquals("123 Green St", result.getPickupAddress());
        verify(pickupRequestRepository).save(any(PickupRequest.class));
        verify(statusHistoryRepository).save(any(PickupStatusHistory.class));
    }

    @Test
    void testGetRequestById_UnauthorizedResident_ThrowsException() {
        PickupRequest request = new PickupRequest();
        request.setId(10L);
        request.setResident(resident1); // Owned by Alice (id=1)
        request.setStatus(RequestStatus.PENDING);

        when(pickupRequestRepository.findById(10L)).thenReturn(Optional.of(request));

        // Bob (id=2) attempts to access Alice's request
        assertThrows(UnauthorizedException.class, () -> {
            pickupRequestService.getRequestById(resident2Principal, 10L);
        });
    }

    @Test
    void testUpdateRequest_WhenAlreadyAssigned_ThrowsException() {
        PickupRequest request = new PickupRequest();
        request.setId(10L);
        request.setResident(resident1);
        request.setStatus(RequestStatus.ASSIGNED); // Not PENDING

        when(pickupRequestRepository.findById(10L)).thenReturn(Optional.of(request));

        UpdatePickupRequestDto updateDto = new UpdatePickupRequestDto();
        updateDto.setWasteCategory(WasteCategory.RECYCLABLE);
        updateDto.setPickupAddress("New Address");
        updateDto.setLocality("Downtown");
        updateDto.setPreferredPickupDate(LocalDate.now().plusDays(2));

        assertThrows(BadRequestException.class, () -> {
            pickupRequestService.updateRequest(resident1Principal, 10L, updateDto);
        });
    }

    @Test
    void testCancelRequest_WhenAlreadyCollected_ThrowsException() {
        PickupRequest request = new PickupRequest();
        request.setId(10L);
        request.setResident(resident1);
        request.setStatus(RequestStatus.COLLECTED);

        when(pickupRequestRepository.findById(10L)).thenReturn(Optional.of(request));

        assertThrows(InvalidStatusTransitionException.class, () -> {
            pickupRequestService.cancelRequest(resident1Principal, 10L);
        });
    }

    @Test
    void testCancelRequest_Success() {
        PickupRequest request = new PickupRequest();
        request.setId(10L);
        request.setResident(resident1);
        request.setStatus(RequestStatus.PENDING);

        when(pickupRequestRepository.findById(10L)).thenReturn(Optional.of(request));
        when(userRepository.findById(1L)).thenReturn(Optional.of(resident1));
        when(pickupRequestRepository.save(any(PickupRequest.class))).thenAnswer(i -> i.getArgument(0));

        PickupRequestDto result = pickupRequestService.cancelRequest(resident1Principal, 10L);

        assertEquals(RequestStatus.CANCELLED, result.getStatus());
        verify(statusHistoryRepository).save(any(PickupStatusHistory.class));
    }
}
