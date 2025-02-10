const yup = require('yup');

const createProductsSchema = yup
    .object({
        name: yup
            .string()
            .required('El nombre es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        // tipo: yup
            // .string()
            // .tipo('Debe ser un tipo válido')
            // .required('El tipo es obligatorio'),
        stock: yup
            .number()
            .positive('El stock debe ser un número positivo')
            .integer('El stock debe ser un número entero')
            .optional()
    })
    // Forzamos el modo estricto
    .strict()
    // Prohibimos campos no definidos
    .noUnknown(true, 'Solo se permiten los campos "name", y "stock"');


module.exports = {
    createProductsSchema
};
