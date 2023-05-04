import React, { useEffect, useRef, useState } from 'react'
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { CommonService } from 'react-codegen-comp';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';
import './SchemaDetailsStyles.css';
import { Loader } from '../components/Loader';
import { Toast } from 'primereact/toast';

const SchemaDetails = (props: any) => {
    const fileUploadRef = useRef(null);
    const [fields, setFields] = useState<any[]>(props.selectedRow.columnInfo || []);
    const [tableName, setTableName] = useState<string>(props.selectedRow.tableName || '');
    const [tableDescription, setTableDescription] = useState<string>(props.selectedRow.tableDescription || '');
    const [menuTitle, setMenuTitle] = useState<string>(props.selectedRow.menuTitle || '');
    const [loader, setLoader] = useState<Boolean>(false)
    const [selectedRow, setSelectedRow] = useState<any>({})
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>()
    const toast: any = useRef(null);

    let service = new CommonService('')


    useEffect(() => {
        setFields(props.selectedRow.columnInfo)
        setTableName(props.selectedRow.tableName)
    }, [props])

    const onUpload = (event: any) => {
        if (event.files.length > 1) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'More than one file cannot be uploaded', life: 5000 });
            return
        }
        setLoader(true);
        service.upload(event.files, {}, 'project/upload').then((resp: any) => {
            setLoader(false);
            setFields(resp)
        }).catch((error: any) => {
            setLoader(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Some thing went wrong', life: 3000 })
        })
    }

    const textEditor = (options: any, field: string) => {
        return <InputText type="text" value={options.value} onChange={(e) => {
            options.editorCallback(e.target.value); selectedRow[field] = e.target.value; setSelectedRow(selectedRow);
        }} />
    }

    const toggleEditor = (options: any, field: string) => {
        return <ToggleButton checked={options.value} onChange={(e) => {
            options.editorCallback(e.target.value); selectedRow[field] = e.value; setSelectedRow(selectedRow);
        }} onIcon="pi pi-check" offIcon="pi pi-times" />
    }

    const dataTypeEditor = (options: any) => {
        let dataTypes = [
            { label: "string", value: "string" },
            { label: "integer", value: "integer" },
            { label: "number", value: "number" },
            { label: "boolean", value: "boolean" },
            { label: "date", value: "date" },
            { label: "any", value: "any" }]
        return (
            <Dropdown value={selectedRow.dataType} options={dataTypes} optionLabel="label" optionValue="value"
                onChange={(e: any) => { options.editorCallback(e.target.value); selectedRow.dataType = e.value; setSelectedRow(selectedRow); onFieldEdit() }} placeholder="Select a Status"
                itemTemplate={(option: any) => {
                    return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>
                }} />
        );
    }

    const inputTypeEditor = (options: any) => {
        let inputTypes: any[] = [];
        switch (selectedRow.dataType) {
            case 'number':
                inputTypes = [{ label: "Number", value: "number" }]
                break;
            case 'date':
                inputTypes = [{ label: "Date", value: "date" }]
                break;

            default: inputTypes = [{ label: "Text", value: "text" }, { label: "Text Area", value: "textarea" }, { label: "Dropdown", value: "dropdown" }]
                break;
        }
        return (
            <Dropdown value={options.value} options={inputTypes} optionLabel="label" optionValue="value"
                onChange={(e: any) => { options.editorCallback(e.target.value); selectedRow.inputType = e.value; setSelectedRow(selectedRow); }} placeholder="Select a Status"
                itemTemplate={(option: any) => {
                    return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>
                }} />
        );
    }

    const validationMethodEditor = (options: any) => {
        let validationTypes = [{ label: "Optional", value: "optional" }, { label: "Mandatory", value: "mandatory" },
        { label: "Regular Expression", value: "reg-exp" }]

        return (
            <Dropdown value={selectedRow.validationMethod || 'optional'} options={validationTypes} optionLabel="label" optionValue="value"
                onChange={(e: any) => {
                    options.editorCallback(e.target.value);
                    selectedRow.validationMethod = e.value; setSelectedRow(selectedRow); onFieldEdit();
                }} placeholder="Select a Validation Type"
                itemTemplate={(option: any) => {
                    return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>
                }} />
        );
    }
    const textRegexEditor = (options: any) => {
        return (selectedRow.validationMethod === 'reg-exp' ?
            <InputText type="text" value={options.value} onChange={(e) => { options.editorCallback(e.target.value); selectedRow.regex = e.target.value; setSelectedRow(selectedRow); }} /> : null)
    }
    const getDataTypeBody = (rowData: any) => {
        return rowData.dataType
    }

    const getValidationMethodBody = (rowData: any) => {
        return rowData.validationMethod || 'NA'
    }

    const getInputTypeBody = (rowData: any) => {
        return rowData.inputType || 'NA'
    }

    const toggleBody = (rowData: any, field: string) => {
        return rowData[field] ? 'Yes' : 'No'
    }

    const onFieldEdit = () => {
        // let _fields = [...fields];
        // let { newData, index } = e;
        // _fields[index] = newData;
        // setFields(_fields);

        let _fields = [...fields];
        _fields[selectedRowIndex || 0] = selectedRow
        setFields(_fields);

    }

    const onRowEdit = (e: any) => {
        setSelectedRow(e.data)
        setSelectedRowIndex(e.index)
    }

    const onSave = () => {
        props.onAction('SAVE', { ...props.selectedRow, tableName, tableDescription, menuTitle, columnInfo: fields })
    }
    const header = () => <div className="table-header app-table">MANAGE SCHEMA</div>

    const renderFooter = () => {
        return (
            <div className="flex align-items-center justify-content-end">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text secondary-btn" onClick={() => props.setDisplay(false)} />
                <Button type="submit" icon="pi pi-check" label='Save' className="ml-2 p-button-text primary-btn" onClick={onSave} />
            </div>
        )
    }

    return (
        <Dialog header='Manage Schema' visible={props.display} style={{ width: '90vw' }} className="override-dialog" onHide={() => props.setDisplay(false)} footer={renderFooter} >
            <Toast ref={toast} />
            <Loader loading={loader}></Loader>
            <div className='grid mt-2'>
                <div className="col-4">
                    <label className='mr-2'>Table Name</label>
                    <InputText type="text" value={tableName} onChange={(e) => { setTableName(e.target.value) }} />
                </div>
                <div className="col-4">
                    <label className='mr-2'>Table Description</label>
                    <InputText type="text" value={tableDescription} onChange={(e) => { setTableDescription(e.target.value) }} />
                </div>
                <div className="col-4">
                    <label className='mr-2'>Menu Title</label>
                    <InputText type="text" value={menuTitle} onChange={(e) => { setMenuTitle(e.target.value) }} />
                </div>
            </div>

            <div className='mt-2 mb-3'>
                <FileUpload name="a[]" ref={fileUploadRef} accept=".csv" multiple customUpload={true} uploadHandler={onUpload} auto className="override-upload-btns"
                    emptyTemplate={<p className="m-0">Drag and drop schema file to here to upload.</p>} />
            </div>


            <div className="card p-fluid">
                <DataTable className="override-datatable" resizableColumns={true} value={fields} editMode="row" header={header} dataKey="id" onRowEditInit={onRowEdit} onRowEditComplete={onFieldEdit} paginator rows={10} filterDisplay="menu" responsiveLayout="scroll" columnResizeMode="expand" sortMode="multiple" >
                    <Column field="label" header="Column Label" filter sortable editor={(options) => textEditor(options, 'label')} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="dataType" header="Data Type" filter sortable body={getDataTypeBody} editor={(options) => dataTypeEditor(options)} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="inputType" header="Input Type" filter sortable body={getInputTypeBody} editor={(options) => inputTypeEditor(options)} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="validationMethod" header="Validation Method" body={getValidationMethodBody} filter sortable editor={validationMethodEditor} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="regex" header="Reg Exp" filter sortable editor={textRegexEditor} style={{ width: '20%' }}></Column>

                    <Column field="canDisplay" header="Grid Display" filter sortable body={(rowData) => toggleBody(rowData, 'canDisplay')} editor={(options) => toggleEditor(options, 'canDisplay')} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="canEdit" header="Is Editable" filter sortable body={(rowData) => toggleBody(rowData, 'canEdit')} editor={(options) => toggleEditor(options, 'canEdit')} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="canSort" header="Is Sortable" filter sortable body={(rowData) => toggleBody(rowData, 'canSort')} editor={(options) => toggleEditor(options, 'canSort')} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="canFilter" header="Is Filterable" filter sortable body={(rowData) => toggleBody(rowData, 'canFilter')} editor={(options) => toggleEditor(options, 'canFilter')} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column field="canExport" header="Is Exportable" filter sortable body={(rowData) => toggleBody(rowData, 'canExport')} editor={(options) => toggleEditor(options, 'canExport')} style={{ width: '20%' }} showAddButton={false}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default SchemaDetails