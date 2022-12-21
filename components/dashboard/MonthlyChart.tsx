import ApexCharts from 'apexcharts';
import React from "react";
import useUtils from "../../hooks/useUtils";


export default function MonthlyChart() {
    const utils = useUtils();
    React.useEffect(() => {
        const options = {
            series: [{
                name: 'Earnings',
                data: [76000, 55000, 57000, 56000, 61000, 105000, 63000, 60000, 66000,44000, 55000, 57000, 56000, 61000, 89000]
            }, {
                name: 'Expenses',
                data: [23000, 85000, 101000, 25000, 87000, 24000, 91000, 114000, 94000,76000, 35000, 101000, 98000, 87000,25000]
            }],
            chart: {
                type: 'area',
                height: 350,
                width: '100%',
                // stacked: true,
                toolbar: {
                    show: false,
                    autoSelected: 'zoom',
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '60%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            colors: ['#2196f3', '#DB2777'],
            markers: {
                size: 0,
                hover: {
                    size: 0,
                },
            },
            grid: {
                show: true,
                padding: {
                    left: 0,
                    right: 0,
                },
                strokeDashArray: 3,
            },
            xaxis: {
                categories: [ '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th' ],
                axisBorder: {
                    show: true,
                },
                axisTicks: {
                    show: true,
                },
            },
            yaxis: {
                title: {
                    text: `Amount (${utils.getCurrency().symbol})`
                },
                labels: {
                    formatter: function (value) {
                        return utils.formatShortNumber(value);
                    },
                },
            },
            fill: {
                opacity: 1,
                colors: ['#2196f3', '#DB2777'],
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return utils.formatCurrency(val)
                    }
                }
            }
        };
        const chart = new ApexCharts(document.querySelector('#analytics_chart'), options);

        chart.render();
    }, [])
    return <div id="analytics_chart"></div>;
}