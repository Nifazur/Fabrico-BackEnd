import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import AppError from '../../errorHelpers/AppError';
import { User } from './user.model';
import { IUser } from './user.interface';
import { envVars } from '../../config/env';

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

const updateMe = async (userId: string, payload: Partial<IUser>) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: payload },
        { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    
    return user;
};

const getAllUsers = async (query: any) => {
    const { page = 1, limit = 10, search, role, isActive } = query;
    
    const filter: any = { isDeleted: false };
    
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    
    if (role) {
        filter.role = role;
    }
    
    if (isActive) {
        filter.isActive = isActive;
    }
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort('-createdAt');
    
    const total = await User.countDocuments(filter);
    
    return {
        users,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const deleteUser = async (userId: string) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isDeleted: true },
        { new: true }
    );
    
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    
    return user;
};

const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    
    if (!user.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please set a password first");
    }
    
    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    
    if (!isPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid old password");
    }
    
    const hashedPassword = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
    user.password = hashedPassword;
    await user.save();
    
    return { message: "Password changed successfully" };
};

export const UserService = {
    getMe,
    updateMe,
    getAllUsers,
    deleteUser,
    changePassword
};