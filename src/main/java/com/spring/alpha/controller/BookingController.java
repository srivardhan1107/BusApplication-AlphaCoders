package com.spring.alpha.controller;

import com.alpha.busbooking.dto.BookingRequest;
import com.alpha.busbooking.dto.MessageResponse;
import com.alpha.busbooking.entity.Booking;
import com.alpha.busbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> bookTickets(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        return ResponseEntity.ok(bookingService.bookTickets(authentication.getName(), request));
    }

    @GetMapping("/user/{userId}") // Not implemented in service, keeping my
    public ResponseEntity<List<Booking>> getMyBookingsAlt(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(authentication.getName()));
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> cancelBooking(@PathVariable Long id, Authentication authentication) {
        bookingService.cancelBooking(id, authentication.getName());
        return ResponseEntity.ok(new MessageResponse("Booking cancelled successfully"));
    }
}