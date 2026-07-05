package com.fucar.model;

import java.time.LocalDate;

public class Car {
    private String    carId, carName, color, producer, status, description;
    private int       modelYear, capacity;
    private double    rentPrice;
    private LocalDate importDate;

    public Car() {}

    // Getters & Setters
    public String    getCarId()      { return carId; }
    public void      setCarId(String v)      { carId = v; }
    public String    getCarName()    { return carName; }
    public void      setCarName(String v)    { carName = v; }
    public String    getColor()      { return color; }
    public void      setColor(String v)      { color = v; }
    public String    getProducer()   { return producer; }
    public void      setProducer(String v)   { producer = v; }
    public String    getStatus()     { return status; }
    public void      setStatus(String v)     { status = v; }
    public String    getDescription(){ return description; }
    public void      setDescription(String v){ description = v; }
    public int       getModelYear()  { return modelYear; }
    public void      setModelYear(int v)     { modelYear = v; }
    public int       getCapacity()   { return capacity; }
    public void      setCapacity(int v)      { capacity = v; }
    public double    getRentPrice()  { return rentPrice; }
    public void      setRentPrice(double v)  { rentPrice = v; }
    public LocalDate getImportDate() { return importDate; }
    public void      setImportDate(LocalDate v){ importDate = v; }
}
