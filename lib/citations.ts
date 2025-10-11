import { Citation } from "@/types/citations";

export const removeDuplicateCitations = (citations: Citation[]) => {
    const uniqueCitations = citations.filter((citation, index) => {
        return citations.findIndex(c => c.document_name === citation.document_name) === index;
    });
    return uniqueCitations;
}