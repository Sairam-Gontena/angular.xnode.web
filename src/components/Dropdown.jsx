import React, { useEffect, useState } from 'react'
import { Dropdown as Select } from 'primereact/dropdown';
import { Field, ErrorMessage } from 'formik'
import ErrorText from './ErrorText';

const Dropdown = (props) => {
    const { control } = props
    let [options, setOptions] = useState([{}]);

    useEffect(() => {
        if (control.servicePath) {

        } else {
            setOptions(control.options);
        }
    }, [props])

    return (
        <Field key={control.name} name={control.name}>
            {
                (props) => {
                    const { field, meta } = props
                    return (
                        <div className="field col-12 md:col-6">
                            <span className="p-float-label">
                                <Select id={control.name} {...field} options={options} optionLabel="label" optionValue="value" inputId="label" />
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

export default Dropdown