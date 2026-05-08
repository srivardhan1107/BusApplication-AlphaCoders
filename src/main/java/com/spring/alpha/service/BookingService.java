package com.spring.alpha.service;

import com.alpha.busbooking.dto.BookingRequest;
import com.alpha.busbooking.entity.Booking;
import com.alpha.busbooking.entity.Bus;
import com.alpha.busbooking.entity.User;
import com.alpha.busbooking.repository.BookingRepository;
import com.alpha.busbooking.repository.BusRepository;
import com.alpha.busbooking.repository.UserRepository;
import com.alpha.busbooking.exception.BadRequestException;
import com.alpha.busbooking.exception.ResourceNotFoundException;
import com.alpha.busbooking.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public Booking bookTickets(String username, BookingRequest request) {
        User user = getUserByUsername(username);

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        List<Integer> requestedSeats = request.getSeatNumbers();

        if (bus.getAvailableSeats() < requestedSeats.size()) {
            throw new BadRequestException("Not enough seats available");
        }

        List<Integer> alreadyBooked = bookingRepository.findBookedSeatNumbersByBusId(bus.getId());
        for (Integer seat : requestedSeats) {
            if (seat < 1 || seat > bus.getTotalSeats()) {
                throw new BadRequestException("Invalid seat number: " + seat);
            }
            if (alreadyBooked.contains(seat)) {
                throw new BadRequestException("Seat " + seat + " is already booked");
            }
        }

        bus.setAvailableSeats(bus.getAvailableSeats() - requestedSeats.size());
        busRepository.save(bus);

        BigDecimal totalAmount = bus.getFare().multiply(new BigDecimal(requestedSeats.size()));

        Booking booking = Booking.builder()
                .user(user)
                .bus(bus)
                .seatNumbers(requestedSeats)
                .numberOfSeats(requestedSeats.size())
                .totalAmount(totalAmount)
                .bookingDate(LocalDateTime.now())
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String username) {
        User user = getUserByUsername(username);
        return bookingRepository.findByUserId(user.getId());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public void cancelBooking(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User user = getUserByUsername(username);

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        Bus bus = booking.getBus();
        bus.setAvailableSeats(bus.getAvailableSeats() + booking.getSeatNumbers().size());
        busRepository.save(bus);

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}