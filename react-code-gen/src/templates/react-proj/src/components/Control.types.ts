export type ControlProps = {
    control: Control
    key: string
}
export type Control = {
    name: string
    label: string
    inputType: string
    dataType: string
    // All other props
    [x: string]: any;
}