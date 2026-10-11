package com.smartwaste.dto.response;

import java.util.Map;

public class ReportSummaryDto {

    private long totalRequests;
    private long totalCompleted;
    private double completionRate;
    private Map<String, Long> requestsByStatus;
    private Map<String, Long> requestsByCategory;
    private Map<String, Long> requestsByLocality;

    public ReportSummaryDto() {
    }

    public ReportSummaryDto(long totalRequests, long totalCompleted, double completionRate,
                            Map<String, Long> requestsByStatus,
                            Map<String, Long> requestsByCategory,
                            Map<String, Long> requestsByLocality) {
        this.totalRequests = totalRequests;
        this.totalCompleted = totalCompleted;
        this.completionRate = completionRate;
        this.requestsByStatus = requestsByStatus;
        this.requestsByCategory = requestsByCategory;
        this.requestsByLocality = requestsByLocality;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getTotalCompleted() {
        return totalCompleted;
    }

    public void setTotalCompleted(long totalCompleted) {
        this.totalCompleted = totalCompleted;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public Map<String, Long> getRequestsByStatus() {
        return requestsByStatus;
    }

    public void setRequestsByStatus(Map<String, Long> requestsByStatus) {
        this.requestsByStatus = requestsByStatus;
    }

    public Map<String, Long> getRequestsByCategory() {
        return requestsByCategory;
    }

    public void setRequestsByCategory(Map<String, Long> requestsByCategory) {
        this.requestsByCategory = requestsByCategory;
    }

    public Map<String, Long> getRequestsByLocality() {
        return requestsByLocality;
    }

    public void setRequestsByLocality(Map<String, Long> requestsByLocality) {
        this.requestsByLocality = requestsByLocality;
    }
}
