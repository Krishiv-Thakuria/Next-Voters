import supportedRegions, { supportedRegionDetails } from "@/data/supported-regions";

export const handleFindOptions = (type: string, region?: string) => {
    if (type === "region") {
        return supportedRegions.map((r) => r.name);
    } else if (type === "politicalAffiliation") {
        return supportedRegions
            .filter((r) => r.name === region)
            .flatMap((r) => r.politicalParties.map((party) => party));
    }
    return [];
}

export const handleFindCollection = (region: string) => {
    const collectionName = supportedRegionDetails.find((r) => r.name === region)?.collectionName;
    return collectionName;
}