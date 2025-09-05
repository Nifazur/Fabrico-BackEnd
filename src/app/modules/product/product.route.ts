import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { createProductValidationSchema, updateProductValidationSchema } from './product.validation';
import { Role } from '../user/user.interface';

const router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/:slug', ProductController.getProductBySlug);

// Admin routes
router.post(
    '/',
    checkAuth(Role.ADMIN),
    validateRequest(createProductValidationSchema),
    ProductController.createProduct
);

router.patch(
    '/:slug',
    checkAuth(Role.ADMIN),
    validateRequest(updateProductValidationSchema),
    ProductController.updateProduct
);

router.delete(
    '/:slug',
    checkAuth(Role.ADMIN),
    ProductController.deleteProduct
);

export const ProductRoutes = router;