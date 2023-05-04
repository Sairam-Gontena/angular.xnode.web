export const commonChartJson = [
    {
        chartName: 'Expenditure Chart',
        chartType: 'line',
        tableName: '',
        chartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Expenditure Overview',
                    data: [5, 10, 8, 16, 12, 25, 30],
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: .4
                },
            ]
        }
    },
    {
        chartName: 'Expenditure Chart',
        chartType: 'bar',
        tableName: '',
        chartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Expenditure',
                    backgroundColor: '#42A5F5',
                    data: [5, 10, 8, 16, 12, 25, 30]
                },
                {
                    label: 'Second Expenditure',
                    backgroundColor: '#FFA726',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }
    },

]