const express = require('express');
const sequelize = require('./config/database');
const validateRequest = require('./middlewares/validateRequest');
const User = require('./models/user')
const Products = require('./models/products')
const { createUserSchema } = require('./validations/userValidation')
const { createProductsSchema } = require('./validations/productsValidation')
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.json());

// =====================================================================
// Rutas de Productos 
// =====================================================================

//===========  5.1. Respuesta de GET /products  =======================//
//================== GET PRODUCTO =====================================//
app.get('/products', async (req, res) => {
    console.log('Obtener lista de products');
    const products = await Products.findAll({
        where: {
            isDelete: false,
        },
    });
    res.json({ message: 'Ok', data: products });
}); 

//===================  5.2. Respuesta de GET /products/:id ====================//
//===================== GET PRODUCTO POR ID  ===================================// 
app.get('/products/:id', async (req, res) => {
    console.log('Obtener un productos por ID');
    const { id } = req.params;
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }
        const products = await Products.findOne({ where: { id, isDelete: false } });
        if (!products) {
            res.status(400).json({ message: `El productso del ID :${id} no existe`, code: "ERROR" })
        }
        res.json({
            message: 'Detalles del Producto',
            data: products,
        });
    } catch (error) {
        console.log("🚀 ~ app.get ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

//==================  5.3. Respuesta de POST /products  ========================//
//=========================== POST CREAR PRODUCTO =============================//
app.post('/products', validateRequest(createProductsSchema), async (req, res) => {
    console.log('Crear un nuevo producto');
    const { name, stock } = req.body;
    try {
        const products = await Products.findOne({ where: { stock, isDelete: false } })
        if (products) res.status(400).json({ message: `Existe un usuario con stock ${stock}` })
        const newProducts = await Products.create({ name, stock });

        res.json({
            message: 'Producto creado exitosamente',
            data: newProducts,

        });
    } catch (error) {cd 
        console.log("🚀 ~ app.post ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

//==================  5.4. Respuesta de PUT /products/:id  ========================//
//=========================== POST ACTUALIAZAR PRODUCTO ===========================//
app.put('/products/:id', validateRequest(createProductsSchema), async (req, res) => {
    console.log('Actualizar un producto por ID');
    const { id } = req.params;
    const { name, stock } = req.body;
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }
        const products = await Products.findByPk(id);
        if (!products) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }
        await Products.update({ name, stock }, { where: { id } });
        res.json({
            message: 'Producto actualizado exitosamente',
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

//==================  5.5. Respuesta de DELETE /products/:id  ========================//
//=========================== DELETE ELIMINAR UN PRODUCTO POR ID =====================//
app.delete('/products/:id', async (req, res) => {
    console.log('Eliminar un producto por ID');

    const { id } = req.params;
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }
        const products = await Products.findOne({ where: { id, isDelete: false } });

        if (!products) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }
        await Products.update({ isDelete: true }, { where: { id } });

        res.json({
            message: 'Producto eliminado exitosamente',
            data: { id },
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});



// =====================================================================
// Rutas de Usuarios
// =====================================================================
app.get('/users', async (req, res) => {
    console.log('Obtener lista de usuarios');
    // Aquí iría la lógica para obtener la lista de usuarios desde la base de datos.
    const users = await User.findAll({
        where: {
            isDelete: false,
        },
    });
    res.json({ message: 'Ok', data: users });
});

// Crear un nuevo usuario
app.post('/users', validateRequest(createUserSchema), async (req, res) => {
    console.log('Crear un nuevo usuario');
    const { name, email, age } = req.body;

    try {
        const user = await User.findOne({ where: { email, isDelete: false } })
        if (user) res.status(400).json({ message: `Existe un usuario con el email ${email}` })
        const newUser = await User.create({ name, email, age });
        res.json({
            message: 'Usuario creado exitosamente',
            data: newUser,
        });
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

// Obtener usuario por ID
app.get('/users/:id', async (req, res) => {
    console.log('Obtener usuario por ID');

    const { id } = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const user = await User.findOne({ where: { id, isDelete: false } });

        if (!user) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }

        res.json({
            message: 'Detalles del usuario',
            data: user,
        });
    } catch (error) {
        console.log("🚀 ~ app.get ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

// Actualizar un usuario por ID
app.put('/users/:id', validateRequest(createUserSchema), async (req, res) => {
    console.log('Actualizar un usuario por ID');
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }
        // Lógica para buscar usuario por ID en la base de datos.
        const user = await User.findByPk(id);
        if (!user) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }
        await User.update({ name, email, age }, { where: { id } });
        res.json({
            message: 'Usuario actualizado exitosamente',
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

// Eliminar un usuario por ID
app.delete('/users/:id', async (req, res) => {
    console.log('Eliminar un usuario por ID');

    const { id } = req.params;
    // Lógica para eliminar el usuario de la base de datos.
    // Ejemplo: await User.destroy({ where: { id } });
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const user = await User.findOne({ where: { id, isDelete: false } });

        if (!user) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }

        await User.update({ isDelete: true }, { where: { id } });

        res.json({
            message: 'Usuario eliminado exitosamente',
            data: { id },
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

// =======================
// Inicializar servidor
// =======================

// Podemos usar una variable de entorno para el puerto, o un valor por defecto (ej. 3000).
const PORT = process.env.PORT_APP || 3000;

/**
 * Sincronizar la base de datos significa que Sequelize revisará tus modelos
 * y creará (o modificará) las tablas necesarias en la base de datos.
 * Luego, iniciamos el servidor Express escuchando en el puerto definido.
 */
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada correctamente');
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });
