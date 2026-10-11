package com.smartwaste.dto.response;

public class WorkerStatsDto {

    private long totalAssignedTasks;
    private long pendingAcceptance;
    private long inProgressTasks;
    private long completedTasks;

    public WorkerStatsDto() {
    }

    public WorkerStatsDto(long totalAssignedTasks, long pendingAcceptance, long inProgressTasks, long completedTasks) {
        this.totalAssignedTasks = totalAssignedTasks;
        this.pendingAcceptance = pendingAcceptance;
        this.inProgressTasks = inProgressTasks;
        this.completedTasks = completedTasks;
    }

    public long getTotalAssignedTasks() {
        return totalAssignedTasks;
    }

    public void setTotalAssignedTasks(long totalAssignedTasks) {
        this.totalAssignedTasks = totalAssignedTasks;
    }

    public long getPendingAcceptance() {
        return pendingAcceptance;
    }

    public void setPendingAcceptance(long pendingAcceptance) {
        this.pendingAcceptance = pendingAcceptance;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }
}
