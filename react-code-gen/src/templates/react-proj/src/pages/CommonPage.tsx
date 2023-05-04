import { useState, useEffect } from "react"
import { CommonForm, CommonTable, getValidationSchema, CommonService } from "react-codegen-comp"
import { getJSONData } from "../util/Util"
// import { CommonForm, CommonTable } from '../components'
// import { CommonService } from "../services/CommonService"
// import { getValidationSchema } from "../util/ValidationSchema"

const Page = (props: any) => {
    let [headers, setHeaders] = useState(props.headers || [])
    let [controls, setControls] = useState(props.controls || [])
    let [validationSchema, setValidationSchema] = useState({})
    let [selectedRow, setSelectedRow] = useState<any>({})
    let [display, setDisplay] = useState(false);
    let [items, setItems] = useState(props.items || []);
    let dataService = new CommonService(props.path)

    useEffect(() => {
        getJSONData("schema.json").then(data => {
            let entity;
            for (const e of data) {
                if (e.servicePath === props.entityCode) {
                    entity = e;
                }
            }
            let headers = []
            let controls = []
            let columnMap = new Map()
            if (entity && entity.columns) {
                for (const column of entity.columns) {
                    columnMap.set(column.name, column)
                    if (column.canDisplay) {
                        headers.push(column)
                    }
                }
                setHeaders(headers)
                for (const name of entity.displayOrder) {
                    controls.push(columnMap.get(name))
                }
                setControls(controls)
                let yup = require('yup')
                const yepSchema = controls.reduce(getValidationSchema, {});
                const validateSchema = yup.object().shape(yepSchema);
                setValidationSchema(validateSchema);
            }
        })

        dataService.getList().then((resp: any) => { setItems(resp.content) });

    }, [props]);



    const onGridAction = (action: string, row: any) => {
        setSelectedRow(row)
        switch (action) {
            case "EDIT":
            case "NEW":
                setDisplay(true)
                break;
            case "DELETE": {
                let _items = items.filter((val: any) => row.id !== val.id);
                dataService.delete(row.id).then((resp: any) => {
                    setItems(_items);
                })
            }
                break;
            default:
                break;
        }
    }

    const onFormAction = (action: string, row: any) => {
        switch (action) {
            case 'SAVE': {
                if (row.id) {
                    dataService.put(row, row.id).then((resp) => {
                        items.forEach((item: any, i: number) => {
                            if (row.id === item.id) {
                                items[i] = resp;
                            }
                        })
                        setItems([...items])
                    })
                } else {
                    dataService.post(row).then((resp) => {
                        setItems([...items, resp])
                    })
                }
                setDisplay(false)
                break;
            }

            default:
                break;
        }
    }

    const header = <div className="table-header app-table">MANAGE ITEMS</div>;

    return (
        <div>
            <CommonForm controls={controls} validationSchema={validationSchema} submitButtonLabel="SAVE"
                data={selectedRow} display={display} setDisplay={setDisplay}
                onAction={onFormAction} title={'Edit Details'}></CommonForm>
            <CommonTable headers={headers} items={items} onAction={onGridAction} hasExport={true} hasUpload={false} isReadOnly={false} itemLabelProp="name" headerTemplate={header}></CommonTable>
        </div>
    )
}

export default Page