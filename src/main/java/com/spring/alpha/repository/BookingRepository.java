package com.spring.alpha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.spring.alpha.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    
    @Query("SELECT s FROM Booking b JOIN b.seatNumbers s WHERE b.bus.id = :busId AND b.status = 'CONFIRMED'")
    List<Integer> findBookedSeatNumbersByBusId(@Param("busId") Long busId);
    
    @Transactional
    void deleteByBusId(Long busId);
}
