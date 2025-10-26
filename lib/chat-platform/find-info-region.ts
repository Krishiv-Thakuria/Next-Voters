import supportedRegions, { supportedRegionDetails } from "@/data/supported-regions";

const handleFindRegionDetails = (type: string, region?: string) => {
    switch (type) {
        case "region":
            return supportedRegions.map((r) => r.name);
        case "politicalAffiliation":
            return supportedRegions
                .filter((r) => r.name === region)
            .flatMap((r) => r.politicalParties.map((party) => party));
        case "collectionName":
            return supportedRegionDetails.find((r) => r.name === region)?.collectionName;
        default:
            return [];
    }
}

export default handleFindRegionDetails;
