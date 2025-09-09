export interface IProductVariant {
    size: string;
    color: string;
    stock: number;
    sku: string;
}

export type Gender = "men" | "women" | "unisex";

export interface IProduct {
    _id?: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    subcategory?: string;
    gender?: Gender;
    brand?: string;
    price: number;
    comparePrice?: number;
    images: string[];
    variants: IProductVariant[];
    tags?: string[];
    featured?: boolean;
    isActive?: boolean;
    totalStock?: number;
    ratings?: number;
    numReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProductQuery {
    search?: string;
    category?: string;
    subcategory?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    sort?: string;
    page?: number;
    limit?: number;
    gender?: "male" | "female" | "unisex";
}