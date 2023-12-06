export interface Credential {
    company: string;
    phone_number_id: string;
    verify_token: string;
    token: string;
    _id?: string;
}

export interface BackendCredentials {
    message: string;
    data: Credential[];
}

export interface BackendCredential {
    message: string;
    data: Credential;
}
