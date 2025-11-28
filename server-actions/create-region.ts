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

        // Extract the array literal from the file by finding the `=` followed by `[` so we
        // don't accidentally pick up type annotation brackets (e.g. `SupportedRegionDetails[]`).
        const equalsBracketMatch = fileContent.match(/=\s*\[/);
        let arrayStart = -1;
        if (equalsBracketMatch && equalsBracketMatch.index !== undefined) {
            arrayStart = equalsBracketMatch.index + equalsBracketMatch[0].indexOf("[");
        } else {
            arrayStart = fileContent.indexOf("[");
        }

        if (arrayStart === -1) {
            throw new Error("Could not locate array literal in supported-regions.ts");
        }

        // Find matching closing bracket for the array literal (handle nested brackets).
        let depth = 0;
        let arrayEnd = -1;
        for (let i = arrayStart; i < fileContent.length; i++) {
            const ch = fileContent[i];
            if (ch === "[") depth++;
            else if (ch === "]") {
                depth--;
                if (depth === 0) {
                    arrayEnd = i;
                    break;
                }
            }
        }

        if (arrayEnd === -1) {
            throw new Error("Could not find matching closing bracket for supported regions array");
        }

        let arrayContent = fileContent.substring(arrayStart, arrayEnd + 1);

        // Strip JS/TS comments (both block and single-line) before parsing.
        arrayContent = arrayContent.replace(/\/\*[\s\S]*?\*\//g, "");
        arrayContent = arrayContent.replace(/\/\/.*(?=[\n\r]|$)/g, "");

        // Quote unquoted object keys (e.g., `code:` → `"code":`).
        // Match word characters followed by a colon, and wrap in quotes if not already quoted.
        arrayContent = arrayContent.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

        // Remove trailing commas before `]` or `}` which are invalid in JSON.
        const sanitizedArrayContent = arrayContent.replace(/,\s*(?=[\]}])/g, "");

        // Parse the existing regions.
        let existingRegions: RegionData[];
        try {
            existingRegions = JSON.parse(sanitizedArrayContent);
        } catch (err) {
            const snippet = sanitizedArrayContent.slice(0, 1000);
            throw new Error(`Failed to parse supported regions array: ${(err as Error).message}. Snippet: ${snippet}`);
        }

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