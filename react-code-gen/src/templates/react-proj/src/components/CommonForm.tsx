import React, { useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Formik, Form } from 'formik'
import { Input } from './Input'
import { Dropdown } from './Dropdown'
import { Number } from './Number'
import { Textarea } from './Textarea'
import { Date } from './Date'
import { Control } from "./Control.types";
import { CommonFormProps } from "./CommonForm.types";

export const CommonForm = (props: CommonFormProps) => {

    let initialValues = props.data || {}
    const onSubmit = (values: any) => {
        console.log(values, 'values');
        props.onAction('SAVE', values)
    }

    useEffect(() => {
        for (const control of props.controls) {
            initialValues[control.name] = props.data[control.name] || ''
        }
    }, [props]);

    const constructControl = (control: Control) => {
        switch (control.inputType) {
            case 'number': return <Number key={control.name} control={control}></Number>
            case 'dropdown': return <Dropdown key={control.name} control={control}></Dropdown>
            case 'textarea': return <Textarea key={control.name} control={control}></Textarea>;
            case 'date': return <Date key={control.name} control={control}></Date>
            case 'text': return <Input key={control.name} control={control}></Input>
            default: return null;
        }
    }

    const renderFooter = (formik: any) => {
        return (
            <div className="flex align-items-center justify-content-end">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text secondary-btn" onClick={() => props.setDisplay(false)} />
                <Button type="submit" icon="pi pi-check" label={props.submitButtonLabel} className="ml-2 p-button-text primary-btn"
                    onClick={() => { onSubmit(formik.values); }} disabled={!(formik.isValid && formik.dirty)} />
            </div>
        )
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={props.validationSchema}
            onSubmit={onSubmit}>
            {
                (formik) => {
                    return (
                        <Dialog header={props.title} visible={props.display} style={{ width: '50vw' }} className="override-dialog" onHide={() => props.setDisplay(false)} footer={renderFooter(formik)} >
                            <Form>
                                <div>
                                    <div className="card">
                                        <div className="p-fluid grid">
                                            {
                                                props.controls.map((control: Control) => { return constructControl(control) })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </Dialog>
                    )
                }
            }
        </Formik>
    )
}