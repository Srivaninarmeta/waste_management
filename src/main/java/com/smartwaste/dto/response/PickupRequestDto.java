package com.smartwaste.dto.response;

import com.smartwaste.entity.PickupRequest;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.entity.WasteCategory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class PickupRequestDto {

    private Long id;
    private String requestNumber;
    private UserSummaryDto resident;
    private UserSummaryDto assignedWorker;
    private WasteCategory wasteCategory;
    private String description;
    private String pickupAddress;
    private String locality;
    private LocalDate preferredPickupDate;
    private RequestStatus status;
    private String residentInstructions;
    private String workerNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime assignedAt;
    private LocalDateTime collectedAt;
    private List<StatusHistoryDto> statusHistories;

    public PickupRequestDto() {
    }

    public static PickupRequestDto fromEntity(PickupRequest entity) {
        if (entity == null) return null;
        PickupRequestDto dto = new PickupRequestDto();
        dto.setId(entity.getId());
        dto.setRequestNumber(entity.getRequestNumber());
        dto.setResident(UserSummaryDto.fromEntity(entity.getResident()));
        dto.setAssignedWorker(UserSummaryDto.fromEntity(entity.getAssignedWorker()));
        dto.setWasteCategory(entity.getWasteCategory());
        dto.setDescription(entity.getDescription());
        dto.setPickupAddress(entity.getPickupAddress());
        dto.setLocality(entity.getLocality());
        dto.setPreferredPickupDate(entity.getPreferredPickupDate());
        dto.setStatus(entity.getStatus());
        dto.setResidentInstructions(entity.getResidentInstructions());
        dto.setWorkerNotes(entity.getWorkerNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setAssignedAt(entity.getAssignedAt());
        dto.setCollectedAt(entity.getCollectedAt());

        if (entity.getStatusHistories() != null) {
            dto.setStatusHistories(entity.getStatusHistories().stream()
                    .map(StatusHistoryDto::fromEntity)
                    .collect(Collectors.toList()));
        } else {
            dto.setStatusHistories(Collections.emptyList());
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber) {
        this.requestNumber = requestNumber;
    }

    public UserSummaryDto getResident() {
        return resident;
    }

    public void setResident(UserSummaryDto resident) {
        this.resident = resident;
    }

    public UserSummaryDto getAssignedWorker() {
        return assignedWorker;
    }

    public void setAssignedWorker(UserSummaryDto assignedWorker) {
        this.assignedWorker = assignedWorker;
    }

    public WasteCategory getWasteCategory() {
        return wasteCategory;
    }

    public void setWasteCategory(WasteCategory wasteCategory) {
        this.wasteCategory = wasteCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public LocalDate getPreferredPickupDate() {
        return preferredPickupDate;
    }

    public void setPreferredPickupDate(LocalDate preferredPickupDate) {
        this.preferredPickupDate = preferredPickupDate;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getResidentInstructions() {
        return residentInstructions;
    }

    public void setResidentInstructions(String residentInstructions) {
        this.residentInstructions = residentInstructions;
    }

    public String getWorkerNotes() {
        return workerNotes;
    }

    public void setWorkerNotes(String workerNotes) {
        this.workerNotes = workerNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public LocalDateTime getCollectedAt() {
        return collectedAt;
    }

    public void setCollectedAt(LocalDateTime collectedAt) {
        this.collectedAt = collectedAt;
    }

    public List<StatusHistoryDto> getStatusHistories() {
        return statusHistories;
    }

    public void setStatusHistories(List<StatusHistoryDto> statusHistories) {
        this.statusHistories = statusHistories;
    }
}
