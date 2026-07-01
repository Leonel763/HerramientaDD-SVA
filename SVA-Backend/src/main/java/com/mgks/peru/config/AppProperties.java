package com.mgks.peru.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProperties {

    public static String ALLOWED_ORIGIN;

    
    @Value("${app.cors.allowed-origin}")
    public void setAllowedOrigin(String allowedOrigin) {
        AppProperties.ALLOWED_ORIGIN = allowedOrigin;
    }
}