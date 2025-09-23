/**
 * Concurrency Optimizations for High-Volume Service Charge Payments
 * 
 * This module provides optimizations to handle 1000+ concurrent payments
 * without system crashes or performance degradation.
 */

/**
 * Database connection pool optimization for high concurrency
 * These should be configured in the backend MongoDB connection
 */
export const RECOMMENDED_DB_CONFIG = {
  // Connection Pool Settings
  maxPoolSize: 50,        // Maximum number of connections in the pool
  minPoolSize: 5,         // Minimum number of connections in the pool
  maxIdleTimeMS: 30000,   // Close connections after 30 seconds of inactivity
  waitQueueTimeoutMS: 5000, // Wait 5 seconds for a connection from pool

  // Write Concern for Atomic Operations
  writeConcern: {
    w: 'majority',        // Wait for majority of replica set
    j: true,             // Wait for journal confirmation
    wtimeout: 10000      // Timeout after 10 seconds
  },

  // Read Preference
  readPreference: 'primaryPreferred', // Read from primary when available

  // Connection Management
  serverSelectionTimeoutMS: 5000,     // Timeout for selecting a server
  socketTimeoutMS: 30000,             // Timeout for socket operations
  connectTimeoutMS: 10000,            // Timeout for initial connection

  // Retry Logic
  retryWrites: true,                  // Retry failed writes
  retryReads: true,                   // Retry failed reads
};

/**
 * Payment processing queue configuration
 * Current: 100 concurrent payments, 5-minute timeout
 * Recommended for 1000+ users:
 */
export const SCALED_QUEUE_CONFIG = {
  MAX_CONCURRENT_PAYMENTS: 200,      // Increased from 100
  QUEUE_TIMEOUT: 180000,             // 3 minutes (reduced from 5)
  BATCH_PROCESSING_SIZE: 50,         // Process in batches
  CLEANUP_INTERVAL: 30000,           // Clean expired items every 30s
};

/**
 * Frontend debouncing and rate limiting
 */
export const FRONTEND_OPTIMIZATIONS = {
  // Atomic Service Charge Hook Settings
  PAYMENT_DEBOUNCE_MS: 2000,         // Increased to 2 seconds
  COOLDOWN_MS: 5000,                 // Increased to 5 seconds
  MAX_RETRIES: 2,                    // Reduced to 2 retries

  // Request Timeout Settings
  API_TIMEOUT_MS: 30000,             // 30-second timeout
  WEBHOOK_VERIFICATION_TIMEOUT: 60000, // 1-minute for verification

  // UI Feedback
  LOADING_STATE_MIN_DURATION: 1000,  // Show loading for at least 1 second
  ERROR_COOLDOWN_DISPLAY: 10000,     // Show error for 10 seconds
};

/**
 * PhonePe API optimization settings
 */
export const PHONEPE_OPTIMIZATIONS = {
  // Connection Pooling for HTTP requests
  MAX_SOCKETS: 100,                  // Maximum concurrent connections
  KEEP_ALIVE: true,                  // Reuse connections
  TIMEOUT: 20000,                    // 20-second timeout

  // Retry Logic
  MAX_RETRIES: 3,                    // Maximum retry attempts
  RETRY_DELAY: 1000,                 // Base delay between retries
  EXPONENTIAL_BACKOFF: true,         // Use exponential backoff

  // Rate Limiting
  REQUESTS_PER_SECOND: 50,           // Limit to PhonePe API
  BURST_LIMIT: 100,                  // Allow bursts up to 100
};

/**
 * Memory and resource optimizations
 */
export const RESOURCE_OPTIMIZATIONS = {
  // Node.js Process Settings
  MAX_OLD_SPACE_SIZE: '4096',        // 4GB heap size
  MAX_SEMI_SPACE_SIZE: '128',        // Young generation size

  // Garbage Collection
  GC_EXPOSE: true,                   // Expose GC to application
  GC_INTERVAL: 60000,                // Force GC every minute during high load

  // Memory Monitoring
  MEMORY_USAGE_THRESHOLD: 0.8,       // Alert at 80% memory usage
  HEAP_USAGE_THRESHOLD: 0.9,         // Alert at 90% heap usage
};

/**
 * Monitoring and alerting thresholds
 */
export const MONITORING_THRESHOLDS = {
  // Response Time Alerts
  PAYMENT_CREATION_MAX_MS: 5000,     // Alert if payment creation > 5s
  WEBHOOK_PROCESSING_MAX_MS: 10000,  // Alert if webhook processing > 10s
  RECEIPT_GENERATION_MAX_MS: 3000,   // Alert if receipt generation > 3s

  // Queue Alerts
  QUEUE_SIZE_WARNING: 500,           // Warning at 500 queued payments
  QUEUE_SIZE_CRITICAL: 1000,         // Critical at 1000 queued payments
  QUEUE_WAIT_TIME_MAX: 30000,        // Alert if wait time > 30s

  // Database Alerts
  CONNECTION_POOL_WARNING: 0.8,      // Warning at 80% pool usage
  SLOW_QUERY_THRESHOLD: 1000,        // Alert on queries > 1s
  LOCK_WAIT_THRESHOLD: 5000,         // Alert on locks > 5s

  // Error Rate Alerts
  ERROR_RATE_WARNING: 0.05,          // Warning at 5% error rate
  ERROR_RATE_CRITICAL: 0.10,         // Critical at 10% error rate
  TIMEOUT_RATE_WARNING: 0.02,        // Warning at 2% timeout rate
};

/**
 * Load balancing and scaling recommendations
 */
export const SCALING_RECOMMENDATIONS = {
  // Horizontal Scaling
  MIN_INSTANCES: 3,                  // Minimum server instances
  MAX_INSTANCES: 10,                 // Maximum server instances
  SCALE_UP_CPU_THRESHOLD: 70,        // Scale up at 70% CPU
  SCALE_DOWN_CPU_THRESHOLD: 30,      // Scale down at 30% CPU

  // Database Scaling
  READ_REPLICAS: 2,                  // Number of read replicas
  SHARD_THRESHOLD: 10000000,         // Shard after 10M documents
  INDEX_OPTIMIZATION: true,          // Optimize indexes for queries

  // CDN and Caching
  RECEIPT_CACHE_TTL: 86400,          // Cache receipts for 24 hours
  STATIC_ASSETS_TTL: 2592000,        // Cache static assets for 30 days
  API_CACHE_TTL: 300,                // Cache API responses for 5 minutes
};

/**
 * Security considerations for high load
 */
export const SECURITY_OPTIMIZATIONS = {
  // Rate Limiting
  GLOBAL_RATE_LIMIT: '1000/hour',    // 1000 requests per hour per IP
  PAYMENT_RATE_LIMIT: '10/hour',     // 10 payments per hour per IP
  LOGIN_RATE_LIMIT: '5/minute',      // 5 login attempts per minute

  // DDoS Protection
  CONNECTION_LIMIT: 1000,            // Max connections per IP
  REQUEST_SIZE_LIMIT: '10mb',        // Max request body size
  TIMEOUT_PROTECTION: 30000,         // 30-second request timeout

  // Webhook Security
  WEBHOOK_IP_WHITELIST: true,        // Only allow PhonePe IPs
  WEBHOOK_SIGNATURE_VERIFY: true,    // Always verify signatures
  WEBHOOK_REPLAY_PROTECTION: true,   // Prevent replay attacks
};

/**
 * Circuit breaker pattern for external services
 */
export const CIRCUIT_BREAKER_CONFIG = {
  // PhonePe API Circuit Breaker
  PHONEPE_FAILURE_THRESHOLD: 5,      // Open circuit after 5 failures
  PHONEPE_RESET_TIMEOUT: 60000,      // Try again after 1 minute
  PHONEPE_HALF_OPEN_REQUESTS: 3,     // Test with 3 requests when half-open

  // Database Circuit Breaker
  DB_FAILURE_THRESHOLD: 3,           // Open circuit after 3 failures
  DB_RESET_TIMEOUT: 30000,           // Try again after 30 seconds
  DB_HALF_OPEN_REQUESTS: 1,          // Test with 1 request when half-open

  // Email Service Circuit Breaker
  EMAIL_FAILURE_THRESHOLD: 10,       // Open circuit after 10 failures
  EMAIL_RESET_TIMEOUT: 300000,       // Try again after 5 minutes
  EMAIL_HALF_OPEN_REQUESTS: 2,       // Test with 2 requests when half-open
};

/**
 * Performance optimization checklist for 1000+ concurrent users
 */
export const PERFORMANCE_CHECKLIST = {
  backend: [
    '✅ Payment queue with 200 concurrent limit implemented',
    '✅ Atomic database operations for race condition prevention',
    '✅ MongoDB connection pooling (50 max connections)',
    '✅ Webhook deduplication and atomic receipt generation',
    '✅ PhonePe SDK with proper timeout and retry logic',
    '📋 Database indexes on payment lookup fields',
    '📋 Redis caching for frequently accessed data',
    '📋 Load balancer with sticky sessions',
    '📋 Auto-scaling based on CPU/memory usage',
    '📋 Health checks and monitoring alerts'
  ],
  frontend: [
    '✅ Atomic service charge hook with debouncing',
    '✅ Request cancellation with AbortController',
    '✅ Comprehensive error handling and recovery',
    '✅ Payment lookup functionality for missed redirects',
    '📋 Progressive Web App (PWA) for offline capability',
    '📋 Service worker for payment state persistence',
    '📋 Image optimization and lazy loading',
    '📋 Bundle splitting and code optimization',
    '📋 CDN for static assets',
    '📋 Client-side caching with proper invalidation'
  ],
  infrastructure: [
    '📋 Multiple server instances behind load balancer',
    '📋 Database read replicas for scaling',
    '📋 Monitoring with Prometheus/Grafana',
    '📋 Log aggregation with ELK stack',
    '📋 SSL/TLS termination at load balancer',
    '📋 DDoS protection and rate limiting',
    '📋 Backup and disaster recovery plan',
    '📋 Auto-scaling policies configured',
    '📋 Circuit breakers for external services',
    '📋 Graceful degradation strategies'
  ]
};

export default {
  RECOMMENDED_DB_CONFIG,
  SCALED_QUEUE_CONFIG,
  FRONTEND_OPTIMIZATIONS,
  PHONEPE_OPTIMIZATIONS,
  RESOURCE_OPTIMIZATIONS,
  MONITORING_THRESHOLDS,
  SCALING_RECOMMENDATIONS,
  SECURITY_OPTIMIZATIONS,
  CIRCUIT_BREAKER_CONFIG,
  PERFORMANCE_CHECKLIST
};
