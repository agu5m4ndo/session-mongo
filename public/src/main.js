const socket = io.connect('http://localhost:8080/');

//-------------------------------LISTA DE PRODUCTOS---------------------------------

//detiene el submit del formulario para crear productos (para poder manejar la info desde socket)
const productForm = document.getElementById('products-form')
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newProduct();
})

const newProduct = () => {
    const name = document.getElementById('name');
    const price = document.getElementById('price');
    const thumbnail = document.getElementById('thumbnail');
    const object = {
        name: name.value,
        price: price.value,
        thumbnail: thumbnail.value,
    }
    name.value = "";
    price.value = "";
    thumbnail.value = "";
    socket.emit('new-product', object);
}

//obtiene la plantilla de handlebars y la inserta en el html con sus datos
const createTable = (productos) => {
    return fetch('../views/products.hbs')
        .then(response => response.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos });
            const table = document.getElementById('table');
            table.innerHTML = html;
        })
        .catch(err => console.log(err))
}

//Obtiene la lista de productos
const createProductList = async() => {
    const productos = await fetch('http://localhost:8080/api/productos')
        .then(res => res.json())
        .then(data => { return data; })
    createTable(productos.result);
}

//Llamado desde el html, crea un nuevo producto
socket.on('products', () => createProductList())

//-------------------------------CENTRO DE MENSAJES---------------------------------

// //variable utilizada en handlebars para ver que parte de la plantilla usar dependiendo si el mail fue insertado
let value = false;
let user = "";

//Llamado desde el html, guarda y emite el nuevo mensaje
const newMessage = () => {
    let line = document.getElementById('mensaje').value;
    let message = {
        email: user.value,
        content: line,
        date: new Date().toLocaleString()
    }
    socket.emit('new-message', message)
}

const mailProvided = () => {
    user = document.getElementById('mail');
    return (user != null && user.value != "");
}

const renderMessageTemplate = async(message) => {
    if (value == false) value = mailProvided();
    return await fetch('../views/messages.hbs')
        .then(res => res.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla)
            const html = template({ value, message }) //En caso de que el mail haya sido provisto, se carga una vista, y además se envía el array de mensajes
            const messages = document.getElementById('messages');
            messages.innerHTML = html;
        })
}

//Llamado desde el html, carga los mensajes al recargar la página
const load = () => {
    socket.emit('load-messages');
}

socket.on('messages', (data) => {
    renderMessageTemplate(data)
})