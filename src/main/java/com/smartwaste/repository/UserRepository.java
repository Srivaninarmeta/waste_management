package com.smartwaste.repository;

import com.smartwaste.entity.Role;
import com.smartwaste.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRole(Role role);

    List<User> findAllByRoleAndActive(Role role, Boolean active);

    Page<User> findAllByRole(Role role, Pageable pageable);

    long countByRole(Role role);

    long countByRoleAndActive(Role role, Boolean active);
}
