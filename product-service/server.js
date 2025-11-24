import express from 'express';
import cors from 'cors';
import rutasProducto from './routes/product.routes.js';

const app = express();
// CORRECCIÓN CLAVE: Usar process.env.PORT para que Render pueda asignar un puerto
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Las rutas de productos están montadas en la raíz del microservicio
app.use('/', rutasProducto);

app.listen(PORT, () => {
    // Render usará el puerto asignado
    console.log(`Servicio de Productos corriendo en el puerto ${PORT}`);
});