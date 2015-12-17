import React from 'react'
import filesize from 'filesize'
import Data from './data'
import Chart from './chart'
import Legend from './legend'
import endpointforBarChart from './endpoint-for-barchart'
import {filter, map} from 'lodash'

import './page-report.css'

// <Chart data={barChartData} options={barChartOptions} type={'Bar'} />
// <Legend reverse={barChartOptions.reverseData} labels={filter(keys(byEndpoint), endpointforBarChart)}/>
export default ({title, entries}) => {
  const barChartEndpoints = filter(map(entries, 'endpoint'), endpointforBarChart)
  const barChartData = {
    labels: barChartEndpoints,
    series: [map(filter(entries, (e) => endpointforBarChart(e.endpoint)), (e) => e.size)]
  }
  const barChartOptions = {
    height: `${barChartEndpoints.length * 40}px`,
    seriesBarDistance: 10,
    horizontalBars: true,
    reverseData: true,
    axisY: {
      offset: 100,
      scaleMinSpace: 130
    },
    axisX: {
      labelInterpolationFnc: (b) => filesize(b, {round: b > 1000000 ? 2 : 0})
    }
  }

  const endpointForPieChart = (e) => e.indexOf('loot-') !== -1
  const pieEndpoints = filter(map(entries, 'endpoint'), endpointForPieChart)
  const restbase = filter(entries, (e) => e.endpoint === 'restbase')[0]
  const pieEntries = filter(entries, (e) => endpointForPieChart(e.endpoint)).map((e) =>
    e.endpoint.indexOf('loot-transform-') !== -1
      ? { ...e, size: restbase.size - e.size }
      : e
  )
  const pieData = {
    labels: pieEndpoints,
    series: map(pieEntries, (e) => e.size)
  }
  // console.log(restbase.size, pieData.series, pieData.series.reduce((a, b) => a+b))
  const pieOptions = {
    total: restbase.size,
    labelInterpolationFnc: (label, i) => (
      label.replace('loot-transform-', '').replace('loot-', '').replace(/^no/, '') +
      ' (' + (pieData.series[i] / pieData.series.reduce((a, b) => a + b) * 100).toFixed(2) + '%)'
    ),
    height: '350px',
    donut: true,
    donutWidth: 60,
    labelOffset: 30,
    labelPosition: 'outside',
    startAngle: 270,
    showLabel: true
  }

  return (
    <div className='PageReport'>
      <div className='PageReport-endpoints'>
        <Data title={title} entries={entries}/>
        <Chart data={barChartData} options={barChartOptions} type={'Bar'} />
      </div>
      <div className='PageReport-restbase'>
        <Chart data={pieData} options={pieOptions} type={'Pie'} />
      </div>
    </div>
  )
}
