export interface Response {
    label: string;
    questions?: Question[];
}

export interface Question {
    label: string;
    responses?: Response[];
}

export interface Scenario {
    _id?: string;
    title: string;
    phone_number_id?: string;
    company?: string;
    active?: boolean;
    description: Question[];
}

export interface BackendScenario {
    message: string;
    data: Scenario[];
}
