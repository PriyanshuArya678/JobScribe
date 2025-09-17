// User types
export interface User {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
    total_experience?: string;
    education: Education[];
    created_at: string;
    updated_at?: string;
}

export interface UserCreate {
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
    total_experience?: string;
    education?: Education[];
}

export interface LoginCredentials {
    username: string; // email
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

// Resume types
export interface Education {
    degree?: string;
    institution?: string;
    duration?: string;
    details?: string;
}

export interface Project {
    title?: string;
    description?: string;
}

export interface WorkExperience {
    company?: string;
    role?: string;
    duration?: string;
    description?: string;
}

export interface Skill {
    name: string;
}

export interface ResumeSchema {
    name?: string;
    email?: string;
    phone?: string;
    skills: Skill[];
    projects: Project[];
    work_experience: WorkExperience[];
    education: Education[];
    certifications: string[];
    achievements: string[];
    total_experience?: string;
}

// Job types
export interface JobData {
    job_title: string;
    company_name: string;
    description: string;
    responsibilities?: string[];
    skills: Skill[];
    experience_level: string;
    location?: string;
    education?: string;
}

export type MatchEnum = "yes" | "no";

export interface ExperienceEducationMatch {
    experience_match: MatchEnum;
    education_match: MatchEnum;
}

// Email content structure
export interface EmailContent {
    subject: string;
    greeting: string;
    para1: string;
    para2: string;
    sign_off: string;
}

// Email generation response
export interface EmailGenerationResponse {
    message?: string;
    structured?: JobData;
    matched_skills?: string[];
    email?: EmailContent;
}

// API Response types
export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
    error?: string;
}

export interface ResumeUploadResponse {
    filename: string;
    content_type: string;
    user: User;
}