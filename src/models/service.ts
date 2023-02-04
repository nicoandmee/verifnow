export interface ServiceAvailability {

  /**
   * Whether the service is available
   */
  available: boolean;

  /**
   * All available zip codes for the service
   */
  availableZips: string[];

  /**
   * All available services
   */
  availableServices: string[];
}
