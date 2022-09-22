const express = require('express');
const axios = require('axios');
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http');

//------------------------------------------SESSION----------------------------------------//

const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

//------------------------------------------RUTAS----------------------------------------//

const mainView = require('./routes/mainView.js');
const productos = require('./routes/products');
const { productosTest } = require('./routes/productsTest');
const { testView } = require('./routes/productsTest');
const login = require('./routes/login')
const logout = require('./routes/logout')

//---------------------------------------ALMACENAMIENTO----------------------------------//

const Contenedor = require('./src/contenedores/contenedor');
const { options } = require('./options/sqlite3');

//------------------------------------------SERVIDOR-------------------------------------//

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const port = 8080;

//------------------------------------------APP.USE()-------------------------------------//

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://usuarioCoderhouse:coderhouse@nodeexpressproject.r8xsu.mongodb.net/session-products-api?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: false,
    rolling: true, //Renueva la session si se ejecutan requests
    cookie: { maxAge: 10 * 60 * 1000 } //La session se eliminará luego de 10 minutos de inactividad
}));
//Para poder interceptar la página principal sin ser enviado al index.html automáticamente,
//necesito crear una ruta para la página principal Y LUEGO servir los archivos públicos
app.use('/', mainView) //Vista principal
app.use(express.static(__dirname + '/public'));
app.use('/api/productos', productos);
app.use('/api/productos-test', productosTest);
app.use('/test', testView); //Vista de prueba
app.use('/login', login); //Vista de login
app.use('/logout', logout); //Vista de logout

//------------------------------------------RUTAS DE SOCKET--------------------------------//

io.of('/logout').on('connection', socket => {
    console.log('Conectado a /logout')
    socket.emit('logout');
})

io.of('/login').on('connection', () => {
    console.log('Conectado a /login');
})

io.of('/test').on('connection', socket => { //test
    console.log('Conectado a /test')
    socket.emit('testing');
})

io.of('/').on('connection', async(socket) => { //ruta principal
    console.log('Conectado a /');
    const messages = new Contenedor('messages', options)

    socket.emit('products');
    socket.emit('messages', await messages.getAll());
    socket.emit('login')

    socket.on('new-product', (products) => {
        axios.post('http://localhost:8080/api/productos', products)
        io.sockets.emit('products')
    })

    socket.on('load-messages', async() => {
        socket.emit('messages', await messages.getAll());
    });

    socket.on('new-message', async(data) => {
        await messages.save(data);
        io.sockets.emit('messages', await messages.getAll())
    })
});

//------------------------------------------CONEXIÓN-------------------------------------//

httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})