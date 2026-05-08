package com.spring.alpha.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.alpha.entity.Bus;

public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findBySourceAndDestinationAndTravelDate(String source, String destination, LocalDate travelDate);
}