import { LinkAssignmentManager } from './LinkAssignmentManager';
import { LinkManagementService } from './LinkManagementService';
import { ProductLinkResolver } from './ProductLinkResolver';

export class PermanentLinkManager {
  private static linkManagementService = LinkManagementService.getInstance();

  static async initialize(): Promise<void> {
    await this.linkManagementService.initialize();
  }

  static assignLink = LinkAssignmentManager.assignLink;
  static getProductByLink = ProductLinkResolver.getProductByLink;
  static getNextAvailableLink = ProductLinkResolver.getNextAvailableLink;

  static async assignLinkToListing(linkId: number, listingId: string): Promise<boolean> {
    return await this.linkManagementService.assignLinkToListing(linkId, listingId);
  }

  static async getAvailableLink() {
    return await this.linkManagementService.getAvailableLink();
  }
}