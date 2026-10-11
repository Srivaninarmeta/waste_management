package com.smartwaste.repository;

import com.smartwaste.entity.PickupRequest;
import com.smartwaste.entity.RequestStatus;
import com.smartwaste.entity.WasteCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, Long>, JpaSpecificationExecutor<PickupRequest> {

    Optional<PickupRequest> findByRequestNumber(String requestNumber);

    Page<PickupRequest> findByResidentId(Long residentId, Pageable pageable);

    Page<PickupRequest> findByAssignedWorkerId(Long workerId, Pageable pageable);

    Page<PickupRequest> findByAssignedWorkerIdAndStatus(Long workerId, RequestStatus status, Pageable pageable);

    Page<PickupRequest> findByAssignedWorkerIdAndStatusIn(Long workerId, List<RequestStatus> statuses, Pageable pageable);

    long countByStatus(RequestStatus status);

    long countByResidentId(Long residentId);

    long countByResidentIdAndStatus(Long residentId, RequestStatus status);

    long countByAssignedWorkerId(Long workerId);

    long countByAssignedWorkerIdAndStatus(Long workerId, RequestStatus status);

    @Query("SELECT r.locality, COUNT(r) FROM PickupRequest r GROUP BY r.locality")
    List<Object[]> countRequestsByLocality();

    @Query("SELECT r.wasteCategory, COUNT(r) FROM PickupRequest r GROUP BY r.wasteCategory")
    List<Object[]> countRequestsByCategory();

    @Query("SELECT r.status, COUNT(r) FROM PickupRequest r GROUP BY r.status")
    List<Object[]> countRequestsByStatus();

    @Query("SELECT r FROM PickupRequest r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:category IS NULL OR r.wasteCategory = :category) AND " +
           "(:locality IS NULL OR LOWER(r.locality) LIKE LOWER(CONCAT('%', :locality, '%'))) AND " +
           "(:startDate IS NULL OR r.preferredPickupDate >= :startDate) AND " +
           "(:endDate IS NULL OR r.preferredPickupDate <= :endDate) AND " +
           "(:search IS NULL OR LOWER(r.requestNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.resident.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(r.pickupAddress) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<PickupRequest> filterRequests(
            @Param("status") RequestStatus status,
            @Param("category") WasteCategory category,
            @Param("locality") String locality,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            Pageable pageable
    );
}
