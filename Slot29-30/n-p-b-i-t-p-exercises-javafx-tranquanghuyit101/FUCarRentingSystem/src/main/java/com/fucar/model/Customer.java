package com.fucar.model;

import java.time.LocalDate;

public class Customer {
    private String    customerId, customerName, mobile, identityCard, email, accountStatus;
    private LocalDate birthday;

    public Customer(String id, String name, String mobile,
                    LocalDate birthday, String idCard,
                    String email, String status) {
        this.customerId    = id;
        this.customerName  = name;
        this.mobile        = mobile;
        this.birthday      = birthday;
        this.identityCard  = idCard;
        this.email         = email;
        this.accountStatus = status;
    }

    public String    getCustomerId()    { return customerId; }
    public String    getCustomerName()  { return customerName; }
    public String    getMobile()        { return mobile; }
    public LocalDate getBirthday()      { return birthday; }
    public String    getIdentityCard()  { return identityCard; }
    public String    getEmail()         { return email; }
    public String    getAccountStatus() { return accountStatus; }
    public void      setAccountStatus(String s) { accountStatus = s; }
}
