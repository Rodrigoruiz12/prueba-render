import express from 'express';
// Importamos las funciones del controlador. Si el error anterior era 'createProduct no existe',
// es posible que tu controlador solo exporte las funciones para obtener datos.
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// ====================================================================
// CORRECCIÓN CLAVE: Definimos la ruta raíz GET / para obtener todos.
// ====================================================================

// 1. Ruta para OBTENER TODOS LOS PRODUCTOS (El Gateway envía "/" a este punto)
router.get('/', getAllProducts);

// 2. Rutas CRUD completas (para Admin y detalle)
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;