export interface OverallSummary {
    overall_summary: {
        id: string;
        content: {
            Title: string;
            Summary: string;
            KeyPoints: string[];
            Actions: string[];
            Participants: any[];
            Tags: string[];
            title: string;
            summary: string;
            keyPoints: string[];
            actions: string[];
            participants: any[];
            tags: string[];
            unknownConcepts?: string[];
            sources?: string[];
        };
        timestamp: string;
    };
    incremental_summary: IncrementalSummary[];
}

export interface IncrementalSummary {
    id: string;
    content: {
        Title: string;
        Summary: string;
        KeyPoints: string[];
        Actions: string[];
        Participants: any[];
        Tags: string[];
        title: string;
        summary: string;
        keyPoints: string[];
        actions: string[];
        participants: any[];
        tags: string[];
    };
    timestamp: string;
}