import { LinkAssignmentManager } from './LinkAssignmentManager';
import { LinkManagementService } from './LinkManagementService';
import { ProductLinkResolver } from './ProductLinkResolver';

export class PermanentLinkManager {
  static initialize = LinkManagementService.initialize;
  static assignLink = LinkAssignmentManager.assignLink;
  static releaseLink = LinkManagementService.releaseLink;
  static getProductByLink = ProductLinkResolver.getProductByLink;
  static getNextAvailableLink = ProductLinkResolver.getNextAvailableLink;
  static recycleExpiredLinks = LinkManagementService.recycleExpiredLinks;
  static recycleLink = LinkManagementService.recycleLink;
}