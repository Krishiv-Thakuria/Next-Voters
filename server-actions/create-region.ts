"use server";

import { promises as fs } from "fs";
import path from "path";
import { createCollection } from "@/lib/ai";    

interface RegionData {
    code: string;
    name: string;
    politicalParties: string[];
    collectionName: string;
    type: string;
    parentRegionCode?: string;
}


const handleCreateRegion = async (data: RegionData) => {
    try {
        if (!data) {
            throw new Error("No data provided");
        }
        
        const { code, name, politicalParties, collectionName, type, parentRegionCode } = data;

        // Validate required fields
        if (!code || !name || !collectionName || !type) {
            throw new Error("Missing required fields: code, name, collectionName, type");
        }

        if (type === "sub-region" && !parentRegionCode) {
            throw new Error("parentRegionCode is required for sub-region type");
        }

        // Read the current supported-regions.ts file
        const filePath = path.join(process.cwd(), "data", "supported-regions.ts");
        const fileContent = await fs.readFile(filePath, "utf-8");

        // Extract the array content from the file
        const arrayStart = fileContent.indexOf("[");
        const arrayEnd = fileContent.lastIndexOf("]");
        const arrayContent = fileContent.substring(arrayStart, arrayEnd + 1);
        
        // Parse the existing regions
        const existingRegions: RegionData[] = JSON.parse(arrayContent);

        // Create new region object
        const newRegion: RegionData = {
            code,
            name,
            politicalParties: typeof politicalParties === "string" ? JSON.parse(politicalParties) : politicalParties,
            collectionName,
            type,
            ...(parentRegionCode && { parentRegionCode })
        };

        // Check if region already exists
        if (existingRegions.some((r: RegionData) => r.code === code)) {
            throw new Error(`Region with code "${code}" already exists`);
        }

        // Create Qdrant collection
        await createCollection(collectionName);
        
        // Add new region to the supported regions file
        existingRegions.push(newRegion);

        // Format the new file content
        const newFileContent = `import { SupportedRegionDetails } from "@/types/supported-regions"

export const supportedRegionDetails: SupportedRegionDetails[] = ${JSON.stringify(existingRegions, null, 2)}

export default supportedRegionDetails;
`;

        // Write back to file
        await fs.writeFile(filePath, newFileContent, "utf-8");

        return { success: true, message: "Region created successfully!" };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export default handleCreateRegion;