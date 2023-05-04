import { Control } from "./Control.types"

export type CommonFormProps = {
    title: string
    controls: Control[]
    data: any
    submitButtonLabel: string
    onAction: (action: 'SAVE', data: any) => void
    display: boolean
    setDisplay: (display: boolean) => void
    validationSchema: any
}