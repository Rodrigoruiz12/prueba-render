import express from 'express';
// Importamos todas las funciones del controlador
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// ====================================================================
// CORRECCIÓN CLAVE: Definimos la ruta raíz GET / para que el Gateway la encuentre.
// ====================================================================

// 1. Ruta para OBTENER TODOS LOS PRODUCTOS (Responde a GET /)
router.get('/', getAllProducts);

// 2. Rutas CRUD completas:
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;