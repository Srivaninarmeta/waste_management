package com.smartwaste.dto.request;

import com.smartwaste.entity.WasteCategory;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreatePickupRequestDto {

    @NotNull(message = "Waste category is required")
    private WasteCategory wasteCategory;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "Pickup address is required")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String pickupAddress;

    @NotBlank(message = "Locality is required")
    @Size(max = 100, message = "Locality must not exceed 100 characters")
    private String locality;

    @NotNull(message = "Preferred pickup date is required")
    @FutureOrPresent(message = "Preferred pickup date cannot be in the past")
    private LocalDate preferredPickupDate;

    @Size(max = 1000, message = "Resident instructions must not exceed 1000 characters")
    private String residentInstructions;

    public CreatePickupRequestDto() {
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

    public String getResidentInstructions() {
        return residentInstructions;
    }

    public void setResidentInstructions(String residentInstructions) {
        this.residentInstructions = residentInstructions;
    }
}
