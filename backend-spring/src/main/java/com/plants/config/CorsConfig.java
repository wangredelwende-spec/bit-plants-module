package com.plants.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS configuration — permissive (all origins, all methods, all headers).
 *
 * PROVISOIRE — à restreindre une fois que la politique d'accès inter-modules
 * aura été tranchée en équipe (cf. section 14/15.B du contexte projet).
 * Ne pas retirer ce commentaire sans avoir mis à jour la config.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");  // provisoire — restreindre à l'URL du frontend en prod
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
