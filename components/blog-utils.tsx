import { Bookmark, RotateCcw, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Helper function to get tier badge
export function getTierBadge(tier?: string) {
  switch (tier) {
    case 'reference':
      return (
        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">
          <Bookmark className="h-3 w-3 mr-1" />
          Reference
        </Badge>
      );
    case 'revisit':
      return (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
          <RotateCcw className="h-3 w-3 mr-1" />
          Revisit
        </Badge>
      );
    case 'read':
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          <Eye className="h-3 w-3 mr-1" />
          Read
        </Badge>
      );
    default:
      return null;
  }
}

// Tier order for sorting (higher number = higher priority)
export const TIER_ORDER = { reference: 3, revisit: 2, read: 1 } as const;

// Helper function to get tier priority for sorting
export function getTierPriority(tier?: string): number {
  return TIER_ORDER[tier as keyof typeof TIER_ORDER] || 0;
} 