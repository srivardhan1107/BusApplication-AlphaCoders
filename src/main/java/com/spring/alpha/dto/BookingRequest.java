package com.spring.alpha.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BookingRequest {
    @NotNull
    private Long busId;

    @NotEmpty
    private List<Integer> seatNumbers;
}
