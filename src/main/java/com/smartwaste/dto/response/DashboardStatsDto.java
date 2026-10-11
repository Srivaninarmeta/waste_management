package com.smartwaste.dto.response;

public class DashboardStatsDto {

    private long totalResidents;
    private long totalActiveWorkers;
    private long totalWorkers;
    private long totalPickupRequests;
    private long pendingRequests;
    private long assignedRequests;
    private long inProgressRequests;
    private long completedRequests;
    private long cancelledRequests;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalResidents, long totalActiveWorkers, long totalWorkers,
                             long totalPickupRequests, long pendingRequests, long assignedRequests,
                             long inProgressRequests, long completedRequests, long cancelledRequests) {
        this.totalResidents = totalResidents;
        this.totalActiveWorkers = totalActiveWorkers;
        this.totalWorkers = totalWorkers;
        this.totalPickupRequests = totalPickupRequests;
        this.pendingRequests = pendingRequests;
        this.assignedRequests = assignedRequests;
        this.inProgressRequests = inProgressRequests;
        this.completedRequests = completedRequests;
        this.cancelledRequests = cancelledRequests;
    }

    public long getTotalResidents() {
        return totalResidents;
    }

    public void setTotalResidents(long totalResidents) {
        this.totalResidents = totalResidents;
    }

    public long getTotalActiveWorkers() {
        return totalActiveWorkers;
    }

    public void setTotalActiveWorkers(long totalActiveWorkers) {
        this.totalActiveWorkers = totalActiveWorkers;
    }

    public long getTotalWorkers() {
        return totalWorkers;
    }

    public void setTotalWorkers(long totalWorkers) {
        this.totalWorkers = totalWorkers;
    }

    public long getTotalPickupRequests() {
        return totalPickupRequests;
    }

    public void setTotalPickupRequests(long totalPickupRequests) {
        this.totalPickupRequests = totalPickupRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getAssignedRequests() {
        return assignedRequests;
    }

    public void setAssignedRequests(long assignedRequests) {
        this.assignedRequests = assignedRequests;
    }

    public long getInProgressRequests() {
        return inProgressRequests;
    }

    public void setInProgressRequests(long inProgressRequests) {
        this.inProgressRequests = inProgressRequests;
    }

    public long getCompletedRequests() {
        return completedRequests;
    }

    public void setCompletedRequests(long completedRequests) {
        this.completedRequests = completedRequests;
    }

    public long getCancelledRequests() {
        return cancelledRequests;
    }

    public void setCancelledRequests(long cancelledRequests) {
        this.cancelledRequests = cancelledRequests;
    }
}
