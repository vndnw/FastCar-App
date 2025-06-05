package com.example.Backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
                .info(new Info()
                        .title("Self-drive Car Rental API")
                        .description("REST API cho hệ thống thuê xe tự lái")
                        .version("v1.0")
                        .contact(new Contact().name("Võ Xuân Dương").email("Lỗi thì tự fix liên hệ cái cc :))")));
    }

//    // Tùy chọn nhóm API
//    @Bean
//    public GroupedOpenApi publicApi() {
//        return GroupedOpenApi.builder()
//                .group("public")
//                .pathsToMatch("/api/**")
//                .build();
//    }
}
