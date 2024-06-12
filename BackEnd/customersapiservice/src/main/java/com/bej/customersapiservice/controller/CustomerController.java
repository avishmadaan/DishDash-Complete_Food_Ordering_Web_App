package com.bej.customersapiservice.controller;

import com.bej.customersapiservice.domain.Customer;
import com.bej.customersapiservice.emails.IGenerateEmails;
import com.bej.customersapiservice.exception.CustomerAlreadyExistException;
import com.bej.customersapiservice.exception.CustomerNotFoundException;
import com.bej.customersapiservice.exception.RestaurantAlreatExistException;
import com.bej.customersapiservice.services.EmailService;
import com.bej.customersapiservice.services.ICustomerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Path;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@Slf4j
@RestController
@RequestMapping("/api/v2")
@CrossOrigin
public class CustomerController {

    @Autowired
    private ICustomerService iCustomerService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private IGenerateEmails iGenerateEmails;

    @PostMapping("/register")
    public ResponseEntity registerCustomer(@RequestBody Customer customer) {
        try {
            ResponseEntity<?> response =  new ResponseEntity(iCustomerService.registerCustomer(customer), HttpStatus.CREATED);
            emailService.sendEmail(customer.getCustomerEmail(),"Welcome To DishDash", iGenerateEmails.generateWelcomeEmail(customer.getCustomerName(), customer.getCustomerEmail(), customer.getCustomerPassword()));
            return response;
        } catch (CustomerAlreadyExistException e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/customers/update")
    public ResponseEntity updateCustomer(@RequestBody Customer customer, HttpServletRequest request) {
        String customerId = (String) request.getAttribute("customerId");
        try {
            return new ResponseEntity(iCustomerService.updateCustomer(customer, customerId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/customers/addfavres")
    public ResponseEntity updateFavRest(@RequestBody String restId, HttpServletRequest request) throws CustomerNotFoundException, RestaurantAlreatExistException {
        String customerId = (String) request.getAttribute("customerId");
        return new ResponseEntity<>(iCustomerService.addFavoriteRestaurant(restId,customerId),HttpStatus.OK);
    }

    @PutMapping("/customers/addfavdish")
    public ResponseEntity updateFavDish(@RequestBody String dishName, HttpServletRequest request) throws CustomerNotFoundException {
        String customerId = (String) request.getAttribute("customerId");
        return new ResponseEntity<>(iCustomerService.addFavoriteDish(dishName,customerId),HttpStatus.OK);
    }

    @GetMapping("/customers/restaurant")
    public ResponseEntity fetchFavRest(HttpServletRequest request)
    {
        String customerId = (String) request.getAttribute("customerId");
        return new ResponseEntity<>(iCustomerService.getAllFavRestaurant(customerId),HttpStatus.OK);
    }
    @GetMapping("/customers/dishes")
    public ResponseEntity fetchFavDish(HttpServletRequest request)
    {
        String customerId = (String) request.getAttribute("customerId");
        return new ResponseEntity<>(iCustomerService.getAllFavDishes(customerId),HttpStatus.OK);
    }
    @GetMapping("/eachcustomer")
    public ResponseEntity<?> fetchByJwtToken(HttpServletRequest request) throws CustomerNotFoundException {
        String customerId = (String) request.getAttribute("customerId");
        return new ResponseEntity<>(iCustomerService.getCustomerById(customerId),HttpStatus.OK);
    }
    @DeleteMapping("/customers/deletedish/{dishName}")
    public ResponseEntity<?> deleteFavDish(@PathVariable String dish, HttpServletRequest request) throws CustomerNotFoundException {
        String customerId = (String) request.getAttribute("customerId");
        return new ResponseEntity<>(iCustomerService.deleteFavDish(customerId,dish),HttpStatus.OK);
    }
    @DeleteMapping("/customers/deletedrestaurant")
    public ResponseEntity<?> deleteFavRest(@RequestParam String restId, HttpServletRequest request) {
        String customerId = (String) request.getAttribute("customerId");
        try{
            log.info("Inside customers/deletedrestaurant controller");
            return new ResponseEntity<>(iCustomerService.deleteFavRestaurant(customerId,restId),HttpStatus.OK);
        }catch(CustomerNotFoundException ex)
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
