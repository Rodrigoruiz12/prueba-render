import express from 'express';
import cors from 'cors';
import rutasProducto from './routes/product.routes.js';

const app = express();
// CRÍTICO: Usar process.env.PORT para que Render asigne el puerto
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// CRÍTICO: Montar el router en la RAÍZ (/)
app.use('/', rutasProducto);

app.listen(PORT, () => {
    console.log(`Servicio de Productos corriendo en el puerto ${PORT}`);
});