import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// Configuración de CORS y JSON
// =======================================================
// Permite que CUALQUIER origen (Vercel) llame al Gateway.
app.use(cors({ origin: '*' }));
// Manejo de cuerpos JSON (necesario para POST/PUT/DELETE)
app.use(express.json());

// =======================================================
// CONFIGURACIÓN DE MICROSERVICIOS (URLs y Proxy)
// =======================================================
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const LOGIN_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const USER_URL = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const CART_URL = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const BLOG_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';


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

// ====================================================================================
// CONFIGURACIÓN DE PROXIES CON REESCRITURA ESPECÍFICA
// ====================================================================================

// 1. PRODUCTOS: Reescritura estricta para el catálogo (la causa del 404)
app.use('/api/products', proxy(PRODUCT_URL, {
    // CORRECCIÓN: Si el frontend pide /api/products, lo convierte en "".
    // El '|| /' asegura que el resultado sea siempre "/" si la cadena está vacía.
    // Esto es NECESARIO para que el microservicio que usa app.use('/', rutasProducto) responda.
    proxyReqPathResolver: (req) => req.originalUrl.replace('/api/products', '') || '/'
}));

// 2. OTROS SERVICIOS: Reescritura simple (solo elimina /api)
// Esto envía /login, /users, /cart, /blog al microservicio.
const simplePathResolver = (req) => req.originalUrl.replace('/api', '');

app.use('/api/login', proxy(LOGIN_URL, {
    proxyReqPathResolver: simplePathResolver
}));
app.use('/api/users', proxy(USER_URL, {
    proxyReqPathResolver: simplePathResolver
}));
app.use('/api/cart', proxy(CART_URL, {
    proxyReqPathResolver: simplePathResolver
}));
app.use('/api/blog', proxy(BLOG_URL, {
    proxyReqPathResolver: simplePathResolver
}));


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