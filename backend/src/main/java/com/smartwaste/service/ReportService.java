package com.smartwaste.service;

import com.smartwaste.dto.response.ReportSummaryDto;
import com.smartwaste.entity.PickupRequest;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.entity.WasteCategory;
import com.smartwaste.repository.PickupRequestRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final PickupRequestRepository pickupRequestRepository;

    public ReportService(PickupRequestRepository pickupRequestRepository) {
        this.pickupRequestRepository = pickupRequestRepository;
    }

    @Transactional(readOnly = true)
    public ReportSummaryDto getReportSummary(LocalDate startDate, LocalDate endDate) {
        List<Object[]> statusCounts = pickupRequestRepository.countRequestsByStatus();
        List<Object[]> categoryCounts = pickupRequestRepository.countRequestsByCategory();
        List<Object[]> localityCounts = pickupRequestRepository.countRequestsByLocality();

        Map<String, Long> requestsByStatus = new HashMap<>();
        long total = 0;
        long completed = 0;

        for (Object[] row : statusCounts) {
            RequestStatus status = (RequestStatus) row[0];
            Long count = (Long) row[1];
            requestsByStatus.put(status.name(), count);
            total += count;
            if (status == RequestStatus.COLLECTED) {
                completed = count;
            }
        }

        Map<String, Long> requestsByCategory = new HashMap<>();
        for (Object[] row : categoryCounts) {
            WasteCategory cat = (WasteCategory) row[0];
            Long count = (Long) row[1];
            requestsByCategory.put(cat.name(), count);
        }

        Map<String, Long> requestsByLocality = new HashMap<>();
        for (Object[] row : localityCounts) {
            String loc = (String) row[0];
            Long count = (Long) row[1];
            requestsByLocality.put(loc != null ? loc : "Unknown", count);
        }

        double rate = total > 0 ? ((double) completed / total) * 100.0 : 0.0;
        rate = Math.round(rate * 10.0) / 10.0;

        return new ReportSummaryDto(total, completed, rate, requestsByStatus, requestsByCategory, requestsByLocality);
    }

    @Transactional(readOnly = true)
    public byte[] exportRequestsToCsv(
            RequestStatus status,
            WasteCategory category,
            String locality,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<PickupRequest> requests = pickupRequestRepository.filterRequests(
                status, category, locality, startDate, endDate, null, Pageable.unpaged()
        ).getContent();

        StringBuilder csv = new StringBuilder();
        csv.append("Request Number,Resident Name,Resident Email,Locality,Pickup Address,Category,Preferred Date,Status,Assigned Worker,Created At,Collected At,Worker Notes\n");

        for (PickupRequest req : requests) {
            String workerName = req.getAssignedWorker() != null ? escapeCsv(req.getAssignedWorker().getFullName()) : "Unassigned";
            String collectedAtStr = req.getCollectedAt() != null ? req.getCollectedAt().toString() : "N/A";
            String notes = req.getWorkerNotes() != null ? escapeCsv(req.getWorkerNotes()) : "";

            csv.append(escapeCsv(req.getRequestNumber())).append(",")
                    .append(escapeCsv(req.getResident().getFullName())).append(",")
                    .append(escapeCsv(req.getResident().getEmail())).append(",")
                    .append(escapeCsv(req.getLocality())).append(",")
                    .append(escapeCsv(req.getPickupAddress())).append(",")
                    .append(req.getWasteCategory().name()).append(",")
                    .append(req.getPreferredPickupDate().toString()).append(",")
                    .append(req.getStatus().name()).append(",")
                    .append(workerName).append(",")
                    .append(req.getCreatedAt().toString()).append(",")
                    .append(collectedAtStr).append(",")
                    .append(notes).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"") || val.contains("\n")) {
            return "\"" + val.replace("\"", "\"\"") + "\"";
        }
        return val;
    }
}
