package com.moneymanager.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableMongoRepositories(basePackages = "com.moneymanager.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${mongodb.host:localhost}")
    private String host;

    @Value("${mongodb.port:27017}")
    private String port;

    @Value("${mongodb.database:money_manager}")
    private String database;

    @Value("${mongodb.username:}")
    private String username;

    @Value("${mongodb.password:}")
    private String password;

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        return database;
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        String connectionString;

        // If a direct URI is provided, use it (assumes it's already properly encoded)
        if (mongoUri != null && !mongoUri.isEmpty() && !mongoUri.contains("REPLACE")) {
            connectionString = mongoUri;
        } else if (username != null && !username.isEmpty() && password != null && !password.isEmpty()) {
            // Build connection string with URL-encoded credentials
            String encodedUsername = URLEncoder.encode(username, StandardCharsets.UTF_8);
            String encodedPassword = URLEncoder.encode(password, StandardCharsets.UTF_8);
            
            // Check if it's a MongoDB Atlas connection (contains mongodb.net)
            if (host.contains("mongodb.net")) {
                connectionString = String.format(
                    "mongodb+srv://%s:%s@%s/%s?retryWrites=true&w=majority",
                    encodedUsername,
                    encodedPassword,
                    host,
                    database
                );
            } else {
                // Local MongoDB connection
                connectionString = String.format(
                    "mongodb://%s:%s@%s:%s/%s?authSource=admin",
                    encodedUsername,
                    encodedPassword,
                    host,
                    port,
                    database
                );
            }
        } else {
            // Local MongoDB without authentication
            if (host.equals("localhost") || host.equals("127.0.0.1")) {
                connectionString = String.format("mongodb://%s:%s/%s", host, port, database);
            } else {
                throw new IllegalStateException(
                    "MongoDB configuration error: Please provide valid credentials. " +
                    "Update application.properties with your MongoDB Atlas credentials."
                );
            }
        }

        System.out.println("========================================");
        System.out.println("MongoDB Connection Info:");
        System.out.println("  Host: " + host);
        System.out.println("  Database: " + database);
        System.out.println("  Username: " + (username != null && !username.isEmpty() ? username : "(not set)"));
        System.out.println("  Password: " + (password != null && !password.isEmpty() ? "****" : "(not set)"));
        System.out.println("========================================");

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .build();

        return MongoClients.create(settings);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }
}
