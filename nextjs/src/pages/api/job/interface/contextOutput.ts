export class ContextOutput {
    id: number;
    output: string;
    contextPredefinedPromptId: number;
    visibility: boolean;

    constructor(id: number, output: string, contextPredefinedPromptId: number, visibility: boolean) {
        this.id = id;
        this.output = output;
        this.contextPredefinedPromptId = contextPredefinedPromptId;
        this.visibility = visibility;
    }

    static create(id: number, output: string, contextPredefinedPromptId: number, visibility: boolean) : ContextOutput {
        return new ContextOutput(id, output, contextPredefinedPromptId, visibility);
    }
}