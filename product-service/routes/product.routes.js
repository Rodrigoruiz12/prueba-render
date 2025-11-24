import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'; // Ajusta el path si es necesario

const router = express.Router();

// ====================================================================
// CORRECCIÓN: Definimos la ruta raíz GET / para que el Gateway la encuentre
// ====================================================================

// Ruta para OBTENER TODOS LOS PRODUCTOS (Responde a GET /)
router.get('/', getAllProducts);

// Rutas para productos individuales
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;