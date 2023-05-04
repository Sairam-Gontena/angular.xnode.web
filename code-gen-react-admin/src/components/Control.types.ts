export type ControlProps = {
    control: Control
    key: string
}
export type Control = {
    name: string
    label: string
    inputType: string
    hyperlink?: string
    hyperlinkParams?: string[]
    dataType: string
    // All other props
    [x: string]: any;
}

// Chart Datatypes
export type chartDataControl = {
    labels: object[]
    datasets: object[]
}
export type chartControl = {
    chartType: string
    chartName: string
    tableName: string
    chartData: chartDataControl
    // All other props
    [x: string]: any;
}