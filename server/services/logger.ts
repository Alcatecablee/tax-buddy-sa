/**
 * Structured Logger for Production Monitoring
 * 
 * Provides consistent, structured logging across the application
 * Compatible with monitoring tools (DataDog, CloudWatch, etc.)
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogContext {
  service?: string;
  endpoint?: string;
  duration?: number;
  statusCode?: number;
  error?: Error | string;
  [key: string]: any;
}

/**
 * Lightweight structured logger
 * Uses JSON format for easy parsing by monitoring tools
 */
class Logger {
  private serviceName: string;
  
  constructor(serviceName: string = 'sars-efiling') {
    this.serviceName = serviceName;
  }
  
  /**
   * Format log entry as JSON for structured logging
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext): string {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...context,
    };
    
    return JSON.stringify(logEntry);
  }
  
  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    console.log(this.formatLog('info', message, context));
  }
  
  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatLog('warn', message, context));
  }
  
  /**
   * Log error message
   */
  error(message: string, context?: LogContext): void {
    console.error(this.formatLog('error', message, context));
  }
  
  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLog('debug', message, context));
    }
  }
  
  /**
   * Create child logger with additional context
   * Useful for adding service-specific or request-specific context
   */
  child(additionalContext: LogContext): ChildLogger {
    return new ChildLogger(this, additionalContext);
  }
}

/**
 * Child logger that inherits context from parent
 */
class ChildLogger {
  constructor(
    private parent: Logger,
    private context: LogContext
  ) {}
  
  info(message: string, additionalContext?: LogContext): void {
    this.parent.info(message, { ...this.context, ...additionalContext });
  }
  
  warn(message: string, additionalContext?: LogContext): void {
    this.parent.warn(message, { ...this.context, ...additionalContext });
  }
  
  error(message: string, additionalContext?: LogContext): void {
    this.parent.error(message, { ...this.context, ...additionalContext });
  }
  
  debug(message: string, additionalContext?: LogContext): void {
    this.parent.debug(message, { ...this.context, ...additionalContext });
  }
}

// Export singleton logger instances for different services
export const logger = new Logger('sars-efiling');
export const sarbApiLogger = logger.child({ service: 'sarb-api' });
export const economicDataLogger = logger.child({ service: 'economic-data' });
