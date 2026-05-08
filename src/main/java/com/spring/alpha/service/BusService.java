package com.spring.alpha.service;

import com.spring.alpha.entity.Bus;
import com.spring.alpha.exception.ResourceNotFoundException;
import com.spring.alpha.repository.BusRepository;
import com.spring.alpha.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BusService {
    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<Bus> searchBuses(String source, String destination, LocalDate travelDate) {
        return busRepository.findBySourceAndDestinationAndTravelDate(source, destination, travelDate);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Bus getBusById(Long id) {
        return busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
    }

    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }

    @Transactional
    public Bus updateBus(Long id, Bus updatedBus) {
        Bus existingBus = busRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bus not found"));
        
        existingBus.setBusName(updatedBus.getBusName());
        existingBus.setSource(updatedBus.getSource());
        existingBus.setDestination(updatedBus.getDestination());
        existingBus.setTravelDate(updatedBus.getTravelDate());
        existingBus.setFare(updatedBus.getFare());
        
        // Handle seat updates properly
        int bookedSeats = existingBus.getTotalSeats() - existingBus.getAvailableSeats();
        if (updatedBus.getTotalSeats() < bookedSeats) {
            throw new com.spring.alpha.exception.BadRequestException("Total seats cannot be less than already booked seats (" + bookedSeats + ")");
        }
        
        existingBus.setTotalSeats(updatedBus.getTotalSeats());
        existingBus.setAvailableSeats(updatedBus.getTotalSeats() - bookedSeats);
        
        return busRepository.save(existingBus);
    }

    @Transactional
    public void deleteBus(Long id) {
        // Delete all bookings for this bus first to avoid foreign key constraint violations
        bookingRepository.deleteByBusId(id);
        busRepository.deleteById(id);
    }
}
