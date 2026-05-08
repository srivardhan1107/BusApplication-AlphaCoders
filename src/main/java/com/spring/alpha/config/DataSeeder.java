package com.spring.alpha.config;

import com.spring.alpha.entity.Bus;
import com.spring.alpha.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private BusRepository busRepository;

    @Override
    public void run(String... args) throws Exception {
        if (busRepository.count() == 0) {
            busRepository.saveAll(List.of(
                    Bus.builder()
                            .busName("Alpha Express")
                            .source("New York")
                            .destination("Boston")
                            .travelDate(LocalDate.now().plusDays(1))
                            .totalSeats(40)
                            .availableSeats(40)
                            .fare(new BigDecimal("25.00"))
                            .build(),
                    Bus.builder()
                            .busName("Beta Travels")
                            .source("New York")
                            .destination("Washington")
                            .travelDate(LocalDate.now().plusDays(1))
                            .totalSeats(30)
                            .availableSeats(30)
                            .fare(new BigDecimal("35.00"))
                            .build(),
                    Bus.builder()
                            .busName("Gamma Lines")
                            .source("Chicago")
                            .destination("Detroit")
                            .travelDate(LocalDate.now().plusDays(2))
                            .totalSeats(50)
                            .availableSeats(50)
                            .fare(new BigDecimal("45.00"))
                            .build()
            ));
            System.out.println("Sample buses seeded!");
        }
    }
}
