const express = require('express');
const axios = require('axios');
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const productos = require('./routes/products');
const { productosTest } = require('./routes/productsTest');
const { testView } = require('./routes/productsTest');
const Contenedor = require('./public/classes/contenedor')
const { options } = require('./options/sqlite3')

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/api/productos', productos);
app.use('/api/productos-test', productosTest);
app.use('/test', testView); //Para devolver el html de test de productos

io.of('/test').on('connection', socket => { //El .of(ruta) te permite diferenciar la ruta donde se está trabajando con socket
    console.log('Conectado a /test')
    socket.emit('testing');
})

io.of('/').on('connection', async(socket) => {
    //Debido a que messages.js usa un módulo de Node, solo puedo acceder desde un entorno que utiliza node
    const messages = new Contenedor('messages', options)
    console.log('Conectado a /');
    socket.emit('products');
    socket.emit('messages', await messages.getAll());
    socket.on('new-product', (products) => {
            axios.post('http://localhost:8080/api/productos', products)
            io.sockets.emit('products')
        })
        //Esta es la única manera que encontré de cargar los mensajes cuando recargamos la página
    socket.on('load-messages', async() => {
        socket.emit('messages', await messages.getAll());
    });
    socket.on('new-message', async(data) => {
        await messages.save(data);
        io.sockets.emit('messages', await messages.getAll())
    })
});


httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})