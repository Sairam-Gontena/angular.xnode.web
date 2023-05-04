import { useEffect } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Formik, Form } from 'formik'
import { Input, Number, Date, Textarea, Dropdown } from "react-codegen-comp";

const CommonForm = (props) => {

    let initialValues = props.data || {}
    const onSubmit = (values) => { props.onAction('SAVE', values) }

    useEffect(() => {
        for (const control of props.controls) {
            initialValues[control.name] = props.data[control.name] || ''
        }
    }, [props]);

    const constructControl = (control) => {
        switch (control.dataType) {
            case 'number': return <Number key={control.name} control={control}></Number>
            case 'dropdown': return <Dropdown key={control.name} control={control}></Dropdown>
            case 'textarea': return <Textarea key={control.name} control={control}></Textarea>;
            case 'date': return <Date key={control.name} control={control}></Date>
            case 'text': return <Input key={control.name} control={control}></Input>
            default: return null;
        }
    }

    return (
        <Dialog header={props.title} visible={props.display} style={{ width: '50vw' }} onHide={() => props.setDisplay(false)}>
            <Formik
                initialValues={initialValues}
                validationSchema={props.validationSchema}
                onSubmit={onSubmit}>
                {
                    (formik) => {
                        return (
                            <Form>
                                <div>
                                    <div className="card">
                                        <div className="p-fluid grid">
                                            {
                                                props.controls.map((control) => { return constructControl(control) })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Button type="submit" label="Submit" className="mt-2" disabled={!(formik.isValid && formik.dirty)} />
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => props.setDisplay(false)} />
                                </div>
                            </Form>
                        )
                    }
                }
            </Formik>
        </Dialog>
    )
}

export default CommonForm