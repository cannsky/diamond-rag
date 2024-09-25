export class ContextInput {
    id: number;
    input: string;
    contextPredefinedPromptId: number;

    constructor(id: number, input: string, contextPredefinedPromptId: number) {
        this.id = id;
        this.input = input;
        this.contextPredefinedPromptId = contextPredefinedPromptId;
    }

    static create(id: number, input: string, contextPredefinedPromptId: number) : ContextInput {
        return new ContextInput(id, input, contextPredefinedPromptId);
    }
}