export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    role: Role[];
    address?: IAddress;
    isVerified?: boolean;
    isActive?: IsActive;
    isDeleted?: boolean;
    auths: IAuthProvider[];
}