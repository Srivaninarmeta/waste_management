package com.smartwaste.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AssignWorkerDto {

    @NotNull(message = "Worker ID is required")
    private Long workerId;

    @Size(max = 500, message = "Assignment notes must not exceed 500 characters")
    private String notes;

    public AssignWorkerDto() {
    }

    public AssignWorkerDto(Long workerId, String notes) {
        this.workerId = workerId;
        this.notes = notes;
    }

    public Long getWorkerId() {
        return workerId;
    }

    public void setWorkerId(Long workerId) {
        this.workerId = workerId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
