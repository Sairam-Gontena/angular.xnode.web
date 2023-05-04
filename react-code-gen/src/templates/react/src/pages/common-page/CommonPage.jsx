import { useState, useEffect } from "react"
import CommonForm from "../../components/common-form/CommonForm"
import CommonTable from "../../components/common-table/CommonTable"
import { CommonService } from "../../components/services/CommonService"
import { getJSONData } from "../../util/Util"
import { getValidationSchema } from "../../util/ValidationSchema"

const Page = (props) => {
    let [headers, setHeaders] = useState(props.headers || [])
    let [controls, setControls] = useState(props.controls || [])
    let [validationSchema, setValidationSchema] = useState({})
    let [selectedRow, setSelectedRow] = useState({})
    let [display, setDisplay] = useState(false);
    let [items, setItems] = useState(props.items || []);
    let dataService = new CommonService(props.path)

    useEffect(() => {
        getJSONData("schema.json").then(data => {
            let entity = data[props.entityCode]
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
                for (const name of entity.display_order) {
                    controls.push(columnMap.get(name))
                }
                setControls(controls)
                let yup = require('yup')
                const yepSchema = controls.reduce(getValidationSchema, {});
                const validateSchema = yup.object().shape(yepSchema);
                setValidationSchema(validateSchema);
            }
        })

        dataService.getList().then(data => setItems(data));

    }, [props]);



    const onGridAction = (action, row) => {
        setSelectedRow(row)
        switch (action) {
            case "EDIT":
            case "NEW":
                setDisplay(true)
                break;
            case "DELETE": {
                let _items = items.filter(val => selectedRow.id !== val.id);
                setItems(_items);
            }
                break;
            default:
                break;
        }
    }

    const onFormAction = (action, row) => {
        switch (action) {
            case 'SAVE': {
                if (row.id) {

                } else {
                    row.id = createId()
                    items.push(row)
                }
                setItems(items)
                setDisplay(false)
                break;
            }

            default:
                break;
        }
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    return (
        <div>
            <CommonForm controls={controls} validationSchema={validationSchema}
                data={selectedRow} display={display} setDisplay={setDisplay}
                onAction={onFormAction} title={'Edit Details'}></CommonForm>
            <CommonTable headers={headers} items={items} onAction={onGridAction}></CommonTable>
        </div>
    )
}

export default Page