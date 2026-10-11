package com.smartwaste.dto.response;

import com.smartwaste.entity.PickupStatusHistory;

import java.time.LocalDateTime;

public class StatusHistoryDto {

    private Long id;
    private Long pickupRequestId;
    private String previousStatus;
    private String newStatus;
    private Long changedByUserId;
    private String changedByUserName;
    private String notes;
    private LocalDateTime changedAt;

    public StatusHistoryDto() {
    }

    public static StatusHistoryDto fromEntity(PickupStatusHistory history) {
        if (history == null) return null;
        StatusHistoryDto dto = new StatusHistoryDto();
        dto.setId(history.getId());
        dto.setPickupRequestId(history.getPickupRequest() != null ? history.getPickupRequest().getId() : null);
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        if (history.getChangedByUser() != null) {
            dto.setChangedByUserId(history.getChangedByUser().getId());
            dto.setChangedByUserName(history.getChangedByUser().getFullName());
        }
        dto.setNotes(history.getNotes());
        dto.setChangedAt(history.getChangedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPickupRequestId() {
        return pickupRequestId;
    }

    public void setPickupRequestId(Long pickupRequestId) {
        this.pickupRequestId = pickupRequestId;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(String previousStatus) {
        this.previousStatus = previousStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public Long getChangedByUserId() {
        return changedByUserId;
    }

    public void setChangedByUserId(Long changedByUserId) {
        this.changedByUserId = changedByUserId;
    }

    public String getChangedByUserName() {
        return changedByUserName;
    }

    public void setChangedByUserName(String changedByUserName) {
        this.changedByUserName = changedByUserName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }
}
