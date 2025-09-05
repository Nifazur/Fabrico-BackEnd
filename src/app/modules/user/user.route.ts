import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { updateProfileValidationSchema, changePasswordValidationSchema } from './user.validation';
import { Role } from './user.interface';

const router = Router();

// User routes
router.get('/me', checkAuth(Role.USER), UserController.getMe);
router.patch(
    '/me',
    checkAuth(Role.USER),
    validateRequest(updateProfileValidationSchema),
    UserController.updateMe
);
router.patch(
    '/change-password',
    checkAuth(Role.USER),
    validateRequest(changePasswordValidationSchema),
    UserController.changePassword
);

// Admin routes
router.get('/', checkAuth(Role.ADMIN), UserController.getAllUsers);
router.delete('/:id', checkAuth(Role.ADMIN), UserController.deleteUser);

export const UserRoutes = router;