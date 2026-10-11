package com.smartwaste.dto.request;

import jakarta.validation.constraints.NotNull;

public class UpdateUserStatusDto {

    @NotNull(message = "Active status is required")
    private Boolean active;

    public UpdateUserStatusDto() {
    }

    public UpdateUserStatusDto(Boolean active) {
        this.active = active;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
