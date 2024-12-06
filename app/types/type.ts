export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    role: string
}

export interface ProjectUser {
    user: User,
    role: string
}

export interface Comment { id: number, text: string, author: string }

export interface Version {
    versionName: string,
    file: string,
    createdAt: string,
    comments: Comment[]  
}

export interface Signature {
    userId: number;
    date: Date;
}

export interface Document {
    id: number,
    name: string,
    signatures: Signature[]
    createdAt: string,
    versions: Version[]
}

export interface Project {
    id: number,
    name: string,
    description: string,
    createdBy: number,
    users: ProjectUser[]
    documents: Document[]
    status: string
}