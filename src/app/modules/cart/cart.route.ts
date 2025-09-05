import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CartController } from './cart.controller';
import { addToCartValidationSchema, updateCartItemValidationSchema } from './cart.validation';
import { Role } from '../user/user.interface';

const router = Router();

// All routes require authentication
router.use(checkAuth(Role.USER));

router.get('/', CartController.getCart);
router.post(
    '/items',
    validateRequest(addToCartValidationSchema),
    CartController.addToCart
);
router.patch(
    '/items/:itemId',
    validateRequest(updateCartItemValidationSchema),
    CartController.updateCartItem
);
router.delete('/items/:itemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export const CartRoutes = router;