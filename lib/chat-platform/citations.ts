import { Citation } from "@/types/citations";

export const removeDuplicateCitations = (citations: Citation[]) => {
    const uniqueCitations = citations.filter((_, index) => {
        return citations.findIndex((citation) => citation.document_name === citation.document_name) === index;
    });
    return uniqueCitations;
}
