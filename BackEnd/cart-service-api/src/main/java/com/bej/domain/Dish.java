package com.bej.domain;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Dish {
    String dishName;
    String dishImage;
    int dishQuantity;
    double dishPrice;
    boolean veg;
}
