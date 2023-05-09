import React from 'react'
import { InputNumber } from 'primereact/inputnumber';
import { Field, ErrorMessage } from 'formik'
import ErrorText from './ErrorText';

const Number = (props) => {
    const { control } = props
    return (
        <Field key={control.name} name={control.name}>
            {
                (props) => {
                    const { field, form, meta } = props
                    return (
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <InputNumber id={control.name}  {...field} onChange={(e) => {
                                    form.setFieldValue(control.name, e.value);
                                }} />
                                <label htmlFor={control.name}>{control.label}</label>
                                {meta.touched && meta.error && <ErrorMessage name={control.name} component={ErrorText}></ErrorMessage>}
                            </span>
                        </div>
                    )
                }
            }
        </Field>
    )
}

export default Number