import React from 'react'
import { InputText } from 'primereact/inputtext';
import { Field, ErrorMessage } from 'formik'
import ErrorText from './ErrorText';

const Input = (props) => {
    const { control } = props
    return (
        <Field key={control.name} name={control.name}>
            {
                (props) => {
                    const { field, meta } = props
                    return (
                        <div key={control.name} className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputText name={control.name} id={control.name} {...field} />
                                <label htmlFor={control.name}>{control.label}</label>
                                {meta.touched && meta.error && <ErrorMessage name={control.name} component={ErrorText}></ErrorMessage>}
                            </span>
                        </div>
                    )
                }
            }
        </Field >
    )
}

export default Input