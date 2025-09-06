import { Schema, model } from 'mongoose';
import { IUser, IsActive, Role } from './user.interface';

const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
}, { _id: false });

const authProviderSchema = new Schema({
    provider: {
        type: String,
        enum: ["google", "credentials"],
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, { _id: false });

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        select: false
    },
    phone: {
        type: String,
        trim: true
    },
    picture: String,
    role: [{
        type: String,
        enum: Object.values(Role),
        default: [Role.USER]
    }],
    address: addressSchema,
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    auths: [authProviderSchema]
}, {
    timestamps: true
});

// Add password selection when needed
userSchema.methods.selectPassword = function() {
    return this.populate('password');
};

export const User = model<IUser>('User', userSchema);