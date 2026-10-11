package com.smartwaste.entity;

public enum RequestStatus {
    PENDING,
    ASSIGNED,
    ACCEPTED,
    IN_PROGRESS,
    COLLECTED,
    CANCELLED;

    public boolean canTransitionTo(RequestStatus target) {
        if (this == target) {
            return true;
        }
        return switch (this) {
            case PENDING -> target == ASSIGNED || target == CANCELLED;
            case ASSIGNED -> target == ACCEPTED || target == ASSIGNED || target == CANCELLED;
            case ACCEPTED -> target == IN_PROGRESS || target == ASSIGNED;
            case IN_PROGRESS -> target == COLLECTED;
            case COLLECTED, CANCELLED -> false; // Terminal states
        };
    }
}
