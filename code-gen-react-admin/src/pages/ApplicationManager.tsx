import { useEffect, useState } from 'react'
import { CommonTable, CommonForm, Control, CommonService, getValidationSchema } from 'react-codegen-comp'
import { APP_MGR_CONFIG } from './ApplicationManager.conf'
// import { CommonService } from '../components';

const ApplicationManager = () => {

    let [headers, setHeaders] = useState<Control[]>([])
    let [controls, setControls] = useState<Control[]>([])
    let [validationSchema, setValidationSchema] = useState({})
    let [selectedRow, setSelectedRow] = useState<any>({})
    let [display, setDisplay] = useState(false);
    let [items, setItems] = useState<any[]>([]);
    let dataService = new CommonService('applications')

    useEffect(() => {
        let entity = APP_MGR_CONFIG
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

        dataService.getList().then((data: any[]) => setItems(data));

    }, []);

    const onGridAction = (action: string, row: any) => {
        setSelectedRow(row)
        switch (action) {
            case "EDIT":
            case "NEW":
                setDisplay(true)
                break;
            case "DELETE": {
                let _items = items.filter((val: any) => row.applicationId !== val.applicationId);
                dataService.delete(row.applicationId).then((resp) => {
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
                if (row.applicationId) {
                    dataService.put(row, row.applicationId).then((resp) => {
                        items.forEach((item, i) => {
                            if (row.applicationId === item.applicationId) {
                                items[i] = resp;
                            }
                        })
                        setItems([...items])
                    })
                } else {
                    row['applicationVersion'] = 1
                    row['clientId'] = 1
                    row['applicationStatus'] = 'TO-BE-DEPLOYED';
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

    // const createId = () => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // }

    const header = <div className="table-header app-table">MANAGE APPLICATIONS</div>

    return (
        <div>
            <CommonForm controls={controls} validationSchema={validationSchema} submitButtonLabel='SAVE'
                data={selectedRow} display={display} setDisplay={setDisplay}
                onAction={onFormAction} title={'Application Details'}></CommonForm>
            <CommonTable headers={headers} items={items} onAction={onGridAction} hasExport={true} hasUpload={false} isReadOnly={false} itemLabelProp='name' headerTemplate={header} ></CommonTable>
        </div>
    )
}

export default ApplicationManager
