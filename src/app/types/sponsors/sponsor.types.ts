export type SponsorBenefit = {
    pk: number;
    description: string;
    name: string;
};

export type SponsorType = {
    pk: number;
    name: string;
    description: string;
    image: string;
    logo: string;
    apply_mode: { pk: number; name: string; description: string };
    category: { pk: number; name: string; icon: string | null };
    apply_url: string;
    response_by: string | null;
    benefits: SponsorBenefit[];
};
