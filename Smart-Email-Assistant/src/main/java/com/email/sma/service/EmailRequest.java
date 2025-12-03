package com.email.sma.service;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;
}
