package com.smartwaste.dto.request;

import com.smartwaste.entity.RequestStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateStatusDto {

    @NotNull(message = "Status is required")
    private RequestStatus status;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    public UpdateStatusDto() {
    }

    public UpdateStatusDto(RequestStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
