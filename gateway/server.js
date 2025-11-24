import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS: Permitir cualquier origen
app.use(cors({ origin: '*' }));
app.use(express.json());

// URLs de los Microservicios (Render Environment Variables)
const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const LOGIN_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:3002';
const USER_URL = process.env.USER_SERVICE_URL || 'http://localhost:3003';
const CART_URL = process.env.CART_SERVICE_URL || 'http://localhost:3004';
const BLOG_URL = process.env.BLOG_SERVICE_URL || 'http://localhost:3005';


// Endpoint de estado
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
// CORRECCIÓN FINAL DE PROXY: Reescritura estricta para Productos (Soluciona 404)
// ====================================================================================

// Esta función genérica resuelve la mayoría de los conflictos: solo elimina /api
const simplePathResolver = (req) => {
    return req.originalUrl.replace('/api', '');
};

// Función específica para Productos (asumiendo que el Microservicio espera "/")
const productsPathResolver = (req) => {
    // Si la ruta es /api/products (sin nada más), la convierte en /
    // Si la ruta es /api/products/123, la convierte en /123
    return req.originalUrl.replace('/api/products', '') || '/';
};


// 1. PRODUCTOS: Usamos el resolver ESPECÍFICO para forzar la ruta raíz (/)
app.use('/api/products', proxy(PRODUCT_URL, {
    proxyReqPathResolver: productsPathResolver
}));

// 2. OTROS SERVICIOS: Usamos el resolver general.
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