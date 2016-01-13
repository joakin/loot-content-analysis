import React from 'react'
import filesize from 'filesize'
import Data from './data'
import Chart from './chart'
import Legend from './legend'
import endpointforBarChart from './endpoint-for-barchart'
import {find, filter, map} from 'lodash'

import './page-report.css'

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

  const restbase = find(entries, 'endpoint', 'restbase')

  const endpointForExtraneous = (e) => e.indexOf('loot-extraneous-') !== -1
  const extraneousEntriesUnparsed = filter(entries, (e) => endpointForExtraneous(e.endpoint))
  const extraneousEntries = extraneousEntriesUnparsed.map((e) => ({
    ...e, size: restbase.size - e.size
  })).filter((e) => e.size > 0)

  const extraneousEntriesTotal = extraneousEntries.reduce((a, e) => a + e.size, 0)
  const othersTotal = restbase.size - extraneousEntriesTotal
  const endpointForOthers = (e) => e.indexOf('loot-others-') !== -1
  const othersEntriesUnparsed = filter(entries, (e) => endpointForOthers(e.endpoint))
  const othersEntries = othersEntriesUnparsed.map((e) => ({
    ...e, size: othersTotal - e.size
  })).filter((e) => e.size > 0)

  console.log(othersTotal)
  console.log(othersEntriesUnparsed)
  var pies = [getPie({
    title: 'Extraneous html transformations size',
    total: restbase.size,
    entries: extraneousEntries,
    endpointToLabel: (label, value, i) =>
      label.replace('loot-extraneous-', '').replace(/^no/, '') +
      ' (' + (value / restbase.size * 100).toFixed(2) + '%)'
  }), getPie({
    title: 'Restbase without extraneous html',
    total: othersTotal,
    entries: othersEntries,
    endpointToLabel: (label, value, i) => (
      label.replace('loot-others-', '').replace(/^no/, '') +
      ' (' + (value / othersTotal * 100).toFixed(2) + '%)'
    )
  })]

  return (
    <div className='PageReport'>
      <h2 className='PageReport-title'>{title}</h2>
      <div className='PageReport-endpoints'>
        <Data title={title} entries={entries}/>
        <Chart data={barChartData} options={barChartOptions} type={'Bar'} />
      </div>
      <div className='PageReport-restbase'>
        <h3>Restbase analysis</h3>
        <div className='PageReport-pies'>
          {pies.map((pie) =>
            <div key={pie.title} className='PageReport-pie'>
              <h4>{pie.title}</h4>
              <Chart data={pie.data} options={pie.options} type={'Pie'} />
              <Legend labels={pie.data.labels.map((l, i) => pie.options.labelInterpolationFnc(l, i))}/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getPie (args) {
  const {
    total, entries, endpointToLabel, width, height, donut, donutWidth, title
  } = {
    width: 300, height: 250,
    donut: true,
    donutWidth: 60,
    ...args
  }
  const sizes = entries.map((e) => e.size)
  const series = sizes.concat(total - sizes.reduce((a, b) => a + b, 0))
  return {
    title,
    entries,
    data: {
      labels: entries.map((e) => e.endpoint).concat('other'),
      series
    },
    options: {
      total: total,
      labelInterpolationFnc: (label, i) => endpointToLabel(label, series[i], i),
      height: `${height}px`,
      width: `${width}px`,
      donut: donut,
      donutWidth: donutWidth,
      startAngle: 270,
      showLabel: true
    }
  }
}
