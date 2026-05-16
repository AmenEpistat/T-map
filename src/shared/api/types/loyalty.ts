import type { VenueCategory } from '@/shared/api';

export type Loyalty = {
    id: string;
    venueId: string;
    venueName: string;
    ruleId: string;
    ruleDescription: string;
    discountApplied: number;
    verifiedAt: string;
    category: VenueCategory;
};
