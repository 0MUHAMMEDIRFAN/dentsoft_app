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