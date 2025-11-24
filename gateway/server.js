import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// CORRECCIÓN CLAVE: Configuración de CORS
// Permitimos que CUALQUIER origen (incluyendo Vercel) pueda llamar al Gateway.
// Esto soluciona los errores de bloqueo del navegador.
// =======================================================
app.use(cors({ origin: '*' }));

// Nota: Para peticiones POST/PUT, los cuerpos deben ser manejados.
// Lo incluimos aquí solo para asegurar que Express pueda leer JSON en las rutas
// que no son proxy, y en el caso de que el proxy lo necesite.
app.use(express.json());

// =======================================================
// CONFIGURACIÓN DE MICROSERVICIOS (URLs y Proxy)
// =======================================================
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const LOGIN_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const USER_URL = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const CART_URL = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const BLOG_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';

// Función para reescribir la ruta y eliminar el prefijo '/api'
// Esto asegura que /api/products/123 se convierta en /123 (o /products/123 si el microservicio usa el prefijo /products)
const customPathResolver = (req) => {
    // Si tu frontend llama a /api/products, el microservicio sólo ve lo que sigue.
    // Usamos el reemplazo simple de '/api' para que el microservicio reciba la ruta esperada.
    return req.originalUrl.replace('/api', '');
};

// Endpoint de estado para verificar que el Gateway vive y ver sus dependencias
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor Gateway funcionando correctamente',
        services: {
            products: PRODUCT_URL,
            login: LOGIN_URL,
            users: USER_URL,
            cart: CART_URL,
            blog: BLOG_URL
        },
        timestamp: new Date().toISOString()
    });
});

// Configuración de Proxies con reescritura de ruta
app.use('/api/products', proxy(PRODUCT_URL, { proxyReqPathResolver: customPathResolver }));
app.use('/api/login', proxy(LOGIN_URL, { proxyReqPathResolver: customPathResolver }));
app.use('/api/users', proxy(USER_URL, { proxyReqPathResolver: customPathResolver }));
app.use('/api/cart', proxy(CART_URL, { proxyReqPathResolver: customPathResolver }));
app.use('/api/blog', proxy(BLOG_URL, { proxyReqPathResolver: customPathResolver }));

// Log de configuración
console.log(`Configurando rutas:
  - Productos: ${PRODUCT_URL}
  - Login: ${LOGIN_URL}
  - Users: ${USER_URL}
  - Cart: ${CART_URL}
  - Blog: ${BLOG_URL}`);


app.listen(PORT, () => {
    console.log(`API Gateway corriendo en el puerto ${PORT}`);
});