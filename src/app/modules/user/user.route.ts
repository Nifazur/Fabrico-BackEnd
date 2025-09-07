import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { updateProfileValidationSchema, changePasswordValidationSchema, createUserZodSchema } from './user.validation';
import { Role } from './user.interface';

const router = Router();

// User create
router.post("/register", validateRequest(createUserZodSchema), UserController.createUser)

// User routes
router.get('/me', checkAuth(...Object.values(Role)), UserController.getMe);
router.patch(
    '/me',
    checkAuth(...Object.values(Role)),
    validateRequest(updateProfileValidationSchema),
    UserController.updateMe
);
router.patch(
    '/change-password',
    checkAuth(...Object.values(Role)),
    validateRequest(changePasswordValidationSchema),
    UserController.changePassword
);

// Admin routes
router.get('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.deleteUser);

export const UserRoutes = router;