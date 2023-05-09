// import * as yup from 'yup'

// export const getValidationSchema = (fields) => {
//     let yup = require('yup')
//     const schema = fields.reduce((schema, field) => {
//         console.log(field, 'ffffffff');
//         const { name, validationType, validationTypeError, validations = [] } = field
//         const isObject = name.indexOf('.') >= 0

//         if (!yup[validationType]) {
//             return schema
//         }
//         let validator = yup[validationType]().typeError(validationTypeError || '')
//         validations.forEach(validation => {
//             const { params, type } = validation
//             if (!validator[type]) {
//                 return
//             }
//             validator = validator[type](...params)
//         })

//         if (!isObject) {
//             return schema.concat(yup.object().shape({ [name]: validator }))
//         }

//         const reversePath = name.split('.').reverse()
//         const currNestedObject = reversePath.slice(1).reduce((yupObj, path, index, source) => {
//             if (!isNaN(path)) {
//                 return { array: yup.array().of(yup.object().shape(yupObj)) }
//             }
//             if (yupObj.array) {
//                 return { [path]: yupObj.array }
//             }
//             return { [path]: yup.object().shape(yupObj) }
//         }, { [reversePath[0]]: validator })

//         const newSchema = yup.object().shape(currNestedObject)
//         return schema.concat(newSchema)
//     }, yup.object().shape({}))

//     return schema
// }


export const getValidationSchema = (schema, config) => {
    let yup = require('yup')
    const { name, validationType, validations = [] } = config;
    if (!yup[validationType]) {
        return schema;
    }
    let validator = yup[validationType]();
    validations.forEach(validation => {
        const { value, type, msg } = validation;
        if (!validator[type]) {
            return;
        }
        validator = validator[type](value, msg);
    });
    schema[name] = validator;
    return schema;
}