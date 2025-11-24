import { pipeline, PipelineType } from '@huggingface/transformers';

type ClassificationResult = {
    label: string;
    score: number;
}[];

const classifyPoliticalConcepts = async (textExcerpt: string): Promise<ClassificationResult> => {
    const pipe = await pipeline('text-classification', 'hemitpatel/political-concepts-classifier' as PipelineType);
    const result = await pipe(textExcerpt);
    return result as ClassificationResult;
}

export default classifyPoliticalConcepts;