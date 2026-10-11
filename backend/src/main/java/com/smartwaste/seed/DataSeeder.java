package com.smartwaste.seed;

import com.smartwaste.entity.*;
import com.smartwaste.repository.PickupRequestRepository;
import com.smartwaste.repository.PickupStatusHistoryRepository;
import com.smartwaste.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PickupRequestRepository pickupRequestRepository;
    private final PickupStatusHistoryRepository statusHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    public DataSeeder(UserRepository userRepository,
                      PickupRequestRepository pickupRequestRepository,
                      PickupStatusHistoryRepository statusHistoryRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.pickupRequestRepository = pickupRequestRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            logger.info("Demo data seeding is disabled.");
            return;
        }

        if (userRepository.count() > 0) {
            logger.info("Database already contains users. Skipping demo data seeding.");
            return;
        }

        logger.info("Seeding demonstration data for Smart Waste Management System...");

        // 1. Seed Administrator
        User admin = new User(
                "System Administrator",
                "admin@waste.com",
                passwordEncoder.encode("admin123"),
                "+1-555-0199",
                "100 Municipal Way, City Center",
                "Downtown",
                Role.ADMIN
        );
        userRepository.save(admin);

        // 2. Seed Workers
        User worker1 = new User(
                "David Miller",
                "worker@waste.com",
                passwordEncoder.encode("worker123"),
                "+1-555-0101",
                "12 Sanitation Yard",
                "North Sector",
                Role.WORKER
        );
        userRepository.save(worker1);

        User worker2 = new User(
                "Sarah Connor",
                "worker2@waste.com",
                passwordEncoder.encode("worker123"),
                "+1-555-0102",
                "34 Recycling Depot",
                "South Sector",
                Role.WORKER
        );
        userRepository.save(worker2);

        // 3. Seed Residents
        User resident1 = new User(
                "Alice Green",
                "resident@waste.com",
                passwordEncoder.encode("resident123"),
                "+1-555-0103",
                "45 Maple Avenue, Apt 2B",
                "Downtown",
                Role.RESIDENT
        );
        userRepository.save(resident1);

        User resident2 = new User(
                "Bob Smith",
                "resident2@waste.com",
                passwordEncoder.encode("resident123"),
                "+1-555-0104",
                "88 Oak Ridge Road",
                "North Sector",
                Role.RESIDENT
        );
        userRepository.save(resident2);

        // 4. Seed Requests across life-cycle states

        // Request 1: PENDING
        PickupRequest req1 = new PickupRequest();
        req1.setRequestNumber("REQ-20261011-1001");
        req1.setResident(resident1);
        req1.setWasteCategory(WasteCategory.E_WASTE);
        req1.setDescription("Old television, broken laptop, and cables");
        req1.setPickupAddress(resident1.getAddress());
        req1.setLocality(resident1.getLocality());
        req1.setPreferredPickupDate(LocalDate.now().plusDays(1));
        req1.setResidentInstructions("Please ring the doorbell upon arrival.");
        req1.setStatus(RequestStatus.PENDING);
        pickupRequestRepository.save(req1);

        statusHistoryRepository.save(new PickupStatusHistory(
                req1, null, RequestStatus.PENDING.name(), resident1, "Request created by resident"
        ));

        // Request 2: ASSIGNED
        PickupRequest req2 = new PickupRequest();
        req2.setRequestNumber("REQ-20261011-1002");
        req2.setResident(resident1);
        req2.setAssignedWorker(worker1);
        req2.setWasteCategory(WasteCategory.RECYCLABLE);
        req2.setDescription("Five cardboard boxes and recyclable beverage containers");
        req2.setPickupAddress(resident1.getAddress());
        req2.setLocality(resident1.getLocality());
        req2.setPreferredPickupDate(LocalDate.now().plusDays(2));
        req2.setResidentInstructions("Items bundled by the garage door.");
        req2.setStatus(RequestStatus.ASSIGNED);
        req2.setAssignedAt(LocalDateTime.now().minusHours(4));
        pickupRequestRepository.save(req2);

        statusHistoryRepository.save(new PickupStatusHistory(
                req2, null, RequestStatus.PENDING.name(), resident1, "Request created by resident"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req2, RequestStatus.PENDING.name(), RequestStatus.ASSIGNED.name(), admin, "Assigned to worker David Miller"
        ));

        // Request 3: ACCEPTED
        PickupRequest req3 = new PickupRequest();
        req3.setRequestNumber("REQ-20261011-1003");
        req3.setResident(resident2);
        req3.setAssignedWorker(worker1);
        req3.setWasteCategory(WasteCategory.ORGANIC);
        req3.setDescription("Yard trimmings and compostable leaves");
        req3.setPickupAddress(resident2.getAddress());
        req3.setLocality(resident2.getLocality());
        req3.setPreferredPickupDate(LocalDate.now());
        req3.setStatus(RequestStatus.ACCEPTED);
        req3.setAssignedAt(LocalDateTime.now().minusHours(6));
        pickupRequestRepository.save(req3);

        statusHistoryRepository.save(new PickupStatusHistory(
                req3, null, RequestStatus.PENDING.name(), resident2, "Request created by resident"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req3, RequestStatus.PENDING.name(), RequestStatus.ASSIGNED.name(), admin, "Assigned to worker David Miller"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req3, RequestStatus.ASSIGNED.name(), RequestStatus.ACCEPTED.name(), worker1, "Task accepted by worker"
        ));

        // Request 4: IN_PROGRESS
        PickupRequest req4 = new PickupRequest();
        req4.setRequestNumber("REQ-20261011-1004");
        req4.setResident(resident2);
        req4.setAssignedWorker(worker1);
        req4.setWasteCategory(WasteCategory.GENERAL);
        req4.setDescription("Household bulk general waste and damaged plastic chairs");
        req4.setPickupAddress(resident2.getAddress());
        req4.setLocality(resident2.getLocality());
        req4.setPreferredPickupDate(LocalDate.now());
        req4.setStatus(RequestStatus.IN_PROGRESS);
        req4.setAssignedAt(LocalDateTime.now().minusHours(8));
        req4.setWorkerNotes("Truck en route to locality");
        pickupRequestRepository.save(req4);

        statusHistoryRepository.save(new PickupStatusHistory(
                req4, null, RequestStatus.PENDING.name(), resident2, "Request created by resident"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req4, RequestStatus.PENDING.name(), RequestStatus.ASSIGNED.name(), admin, "Assigned to worker David Miller"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req4, RequestStatus.ASSIGNED.name(), RequestStatus.ACCEPTED.name(), worker1, "Task accepted"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req4, RequestStatus.ACCEPTED.name(), RequestStatus.IN_PROGRESS.name(), worker1, "Truck en route to locality"
        ));

        // Request 5: COLLECTED
        PickupRequest req5 = new PickupRequest();
        req5.setRequestNumber("REQ-20261011-1005");
        req5.setResident(resident1);
        req5.setAssignedWorker(worker2);
        req5.setWasteCategory(WasteCategory.HAZARDOUS);
        req5.setDescription("Used paint cans and battery disposals");
        req5.setPickupAddress(resident1.getAddress());
        req5.setLocality(resident1.getLocality());
        req5.setPreferredPickupDate(LocalDate.now().minusDays(1));
        req5.setStatus(RequestStatus.COLLECTED);
        req5.setAssignedAt(LocalDateTime.now().minusDays(1).minusHours(3));
        req5.setCollectedAt(LocalDateTime.now().minusDays(1));
        req5.setWorkerNotes("Properly stored in hazardous disposal container and transported to processing unit.");
        pickupRequestRepository.save(req5);

        statusHistoryRepository.save(new PickupStatusHistory(
                req5, null, RequestStatus.PENDING.name(), resident1, "Request created by resident"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req5, RequestStatus.PENDING.name(), RequestStatus.ASSIGNED.name(), admin, "Assigned to Sarah Connor"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req5, RequestStatus.ASSIGNED.name(), RequestStatus.ACCEPTED.name(), worker2, "Accepted"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req5, RequestStatus.ACCEPTED.name(), RequestStatus.IN_PROGRESS.name(), worker2, "Started hazardous pickup route"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req5, RequestStatus.IN_PROGRESS.name(), RequestStatus.COLLECTED.name(), worker2, "Properly collected and sealed"
        ));

        // Request 6: CANCELLED
        PickupRequest req6 = new PickupRequest();
        req6.setRequestNumber("REQ-20261011-1006");
        req6.setResident(resident2);
        req6.setWasteCategory(WasteCategory.CONSTRUCTION);
        req6.setDescription("Drywall scrap and tiles");
        req6.setPickupAddress(resident2.getAddress());
        req6.setLocality(resident2.getLocality());
        req6.setPreferredPickupDate(LocalDate.now().plusDays(3));
        req6.setStatus(RequestStatus.CANCELLED);
        pickupRequestRepository.save(req6);

        statusHistoryRepository.save(new PickupStatusHistory(
                req6, null, RequestStatus.PENDING.name(), resident2, "Request created by resident"
        ));
        statusHistoryRepository.save(new PickupStatusHistory(
                req6, RequestStatus.PENDING.name(), RequestStatus.CANCELLED.name(), resident2, "Cancelled by resident"
        ));

        logger.info("Demo data seeding completed successfully! Created admin, 2 workers, 2 residents, and 6 sample requests.");
    }
}
