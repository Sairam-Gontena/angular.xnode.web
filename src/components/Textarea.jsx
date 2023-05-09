import React from 'react'
import { InputTextarea } from 'primereact/inputtextarea';
import { Field, ErrorMessage } from 'formik'
import ErrorText from './ErrorText';

const Textarea = (props) => {
    const { control } = props
    return (
        <Field key={control.name} name={control.name}>
            {
                (props) => {
                    const { field, meta } = props
                    return (
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputTextarea id={control.name} {...field} />
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

export default Textarea