import { ContextOutput } from '../../job/interface/contextOutput';

export interface ChatJob {
    prompt: string;
    contextOutputs: ContextOutput[];
}