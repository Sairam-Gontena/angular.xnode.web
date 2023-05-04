import { Control } from './Control.types';
export type CommonTableProps = {
    headerTemplate?: React.ReactNode
    footerTemplate?: React.ReactNode
    addLabel?: string
    isReadOnly: Boolean
    hasUpload: Boolean
    hasExport: Boolean
    headers: Control[]
    itemLabelProp: string
    items: any[]
    onAction: (action: 'NEW' | 'EDIT' | 'DELETE', data: any) => void
}