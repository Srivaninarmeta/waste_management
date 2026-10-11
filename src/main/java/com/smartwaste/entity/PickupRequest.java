package com.smartwaste.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pickup_requests", indexes = {
    @Index(name = "idx_pickup_number", columnList = "request_number"),
    @Index(name = "idx_pickup_status", columnList = "status"),
    @Index(name = "idx_pickup_resident", columnList = "resident_id"),
    @Index(name = "idx_pickup_worker", columnList = "assigned_worker_id"),
    @Index(name = "idx_pickup_date", columnList = "preferred_pickup_date"),
    @Index(name = "idx_pickup_locality", columnList = "locality"),
    @Index(name = "idx_pickup_category", columnList = "waste_category")
})
public class PickupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_worker_id")
    private User assignedWorker;

    @Enumerated(EnumType.STRING)
    @Column(name = "waste_category", nullable = false, length = 50)
    private WasteCategory wasteCategory;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "pickup_address", nullable = false, length = 255)
    private String pickupAddress;

    @Column(name = "locality", nullable = false, length = 100)
    private String locality;

    @Column(name = "preferred_pickup_date", nullable = false)
    private LocalDate preferredPickupDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "resident_instructions", columnDefinition = "TEXT")
    private String residentInstructions;

    @Column(name = "worker_notes", columnDefinition = "TEXT")
    private String workerNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @OneToMany(mappedBy = "pickupRequest", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("changedAt DESC")
    private List<PickupStatusHistory> statusHistories = new ArrayList<>();

    public PickupRequest() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RequestStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addStatusHistory(PickupStatusHistory history) {
        statusHistories.add(history);
        history.setPickupRequest(this);
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

    public User getResident() {
        return resident;
    }

    public void setResident(User resident) {
        this.resident = resident;
    }

    public User getAssignedWorker() {
        return assignedWorker;
    }

    public void setAssignedWorker(User assignedWorker) {
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

    public List<PickupStatusHistory> getStatusHistories() {
        return statusHistories;
    }

    public void setStatusHistories(List<PickupStatusHistory> statusHistories) {
        this.statusHistories = statusHistories;
    }
}
