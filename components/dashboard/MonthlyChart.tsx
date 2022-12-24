import ApexCharts from 'apexcharts';
import React from "react";
import useUtils from "../../hooks/useUtils";
import {AnalyticsModel} from "../../models/analytics.model";
import {useSelector} from "react-redux";
import {selectAnalyticsState} from "../../store/slices/analytics.slice";


export default function MonthlyChart() {
    const utils = useUtils();
    const analyticsState: AnalyticsModel = useSelector(selectAnalyticsState);
    const [chart, setChart] = React.useState<ApexCharts>();

    React.useEffect(() => {
        if (!analyticsState?.activity) return;

        if (chart) {
            chart.updateOptions({
                series: [{
                    name: 'Earnings',
                    data: analyticsState.activity.earnings.map(a => ({x: a.date, y: a.amount}))
                }, {
                    name: 'Expenses',
                    data: analyticsState.activity.expenses.map(a => ({x: a.date, y: a.amount}))
                }]
            })
        } else {
            const options = {
                series: [{
                    name: 'Earnings',
                    data: analyticsState.activity.earnings.map(a => a.amount)
                }, {
                    name: 'Expenses',
                    data: analyticsState.activity.expenses.map(a => a.amount)
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
                    categories: analyticsState.activity.earnings.map(a => a.date),
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

            setChart(chart)
            // CLEAR CONTAINER BEFORE NEW RENDER
            // if (window) {
            //     document.getElementById('analytics_chart').innerHTML = '';
            // }

            chart.render();
        }
    }, [analyticsState?.activity?.expenses, analyticsState?.activity?.earnings])
    return <div id="analytics_chart"></div>;
}