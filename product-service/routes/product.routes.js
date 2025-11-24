import express from 'express';
// CORRECCIÓN: SOLO IMPORTAMOS LO QUE EL CONTROLADOR REALMENTE EXPORTA
// Si solo tiene la función para obtener todos, usamos esa.
// Asumo que tienes al menos: getAllProducts, getProductById, createProduct, deleteProduct
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// ====================================================================
// CORRECCIÓN: Definimos la ruta raíz GET / para que el Gateway la encuentre.
// El Gateway ya está enviando "/" al Product Service para el catálogo principal.
// ====================================================================

// 1. Ruta para OBTENER TODOS LOS PRODUCTOS (Responde a GET /)
router.get('/', getAllProducts);

// 2. Rutas CRUD completas:
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;