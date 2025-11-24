import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
// CORRECCIÓN 1: Agregado el operador || para el puerto por defecto
const PORT = process.env.PORT || 3000;

app.use(cors());

// NOTA: No usamos app.use(express.json()) aquí globalmente porque puede
// causar conflictos con el proxy al "consumir" el cuerpo de la petición antes de reenviarlo.

// Endpoint de estado para verificar que el Gateway vive
app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', service: 'Gateway', time: new Date().toISOString() });
});

// Rutas a microservicios (fallback a localhost para desarrollo)
// CORRECCIÓN 2: Agregados los operadores ||
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const LOGIN_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const USER_URL = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const CART_URL = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const BLOG_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

// CORRECCIÓN 3: Uso de comillas invertidas (template strings) para el log
console.log(`Configurando rutas:
  - Productos: ${productsUrl}
  - Login: ${loginUrl}
  - Users: ${usersUrl}
  - Cart: ${cartUrl}
  - Blog: ${blogUrl}`);

// Configuración de Proxies
// El proxy elimina la parte '/api/nombre' y manda el resto al microservicio.
// Ejemplo: /api/products -> http://localhost:3001/
app.use('/api/products', proxy(PRODUCT_URL));
app.use('/api/login', proxy(LOGIN_URL));
app.use('/api/users', proxy(USER_URL));
app.use('/api/cart', proxy(CART_URL));
app.use('/api/blog', proxy(BLOG_URL));

app.listen(PORT, () => {
    console.log(`✅ API Gateway corriendo en puerto ${PORT}`);
});