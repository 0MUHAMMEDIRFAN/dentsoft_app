export interface Patient {
    name?: string;
    first_name: string | undefined;
    patient_name?: string;
    patient_no?: string;
    ID: string;
    email: string;
    mobile: string;
    dob: string;
    custom_scheme?: string;
    scheme?: string;
    sex: string;
    address: string;
    address2: string;
    custom_patient_type?: string;
    patient_type?: string;
    enabled_communications: {
        text: boolean;
        voice: boolean;
        email: boolean;
    };
}

export interface Treatment {
    name: string;
    item_code: string;
    template: string;
    description: string;
    item_group: string;
    rate: number;
    is_billable: number;
    disabled: number;
    creation?: string;
    modified?: string;
    owner?: string;
}

export interface TreatmentForm {
    item_code: string;
    template: string;
    description: string;
    item_group: string;
    rate: string | number;
    is_billable: number;
    disabled: number;
}

export interface FormInput {
    head: string;
    types: Array<{
        type: string;
        text?: string;
    }>;
    name: keyof TreatmentForm;
    required: boolean;
    options?: string[];
}

export interface SelectedTreatment {
    id: string;
    name: string;
}

export type LoadingState = "Loading" | "Loaded" | "Error";

export type TabType = "Active Treatments" | "Inactive Treatments";