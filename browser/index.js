import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import fetch from 'isomorphic-fetch'

import './index.css'

import Chart from './chart'

fetch('./output/stats.json')
  .then((resp) => {
    if (resp.status >= 400) throw new Error('Bad response from server')
    return resp.json()
  })
  .then(init)
  .catch((e) => console.log(e))

// var data = {
//   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//   series: [20, 10, 30, 40, 50]
// }

// var options = {
//   labelInterpolationFnc: (label, i) =>
//     label + ' (' + (data.series[i] / data.series.reduce((a, b) => a + b) * 100).toFixed(2) + '%)',
//   height: '350px',
//   donut: true,
//   donutWidth: 60,
//   labelOffset: 30,
//   labelPosition: 'outside',
//   startAngle: 270,
//   showLabel: true
// }

// var data2 = {
//   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//   series: [
//     [5, 4, 3, 7, 5, 10, 3],
//     [3, 2, 9, 5, 4, 6, 4]
//   ]
// }
// var options2 = {
//   height: `${data.labels.length * 80}px`,
//   seriesBarDistance: 10,
//   horizontalBars: true,
//   reverseData: true,
//   axisY: {
//     offset: 100,
//     scaleMinSpace: 130
//   }
// }
      // <Chart data={data} options={options} type={'Pie'} />
      // <Chart data={data2} options={options2} type={'Bar'} />

import filesize from 'filesize'
import {groupBy, map, keys, get, find} from 'lodash'
import Data from './data'

function init (stats) {
  const byTitle = groupBy(stats, 'title')
  const byEndpoint = groupBy(stats, 'endpoint')
  const pages = keys(byTitle)

  const barChartData = {
    labels: pages,
    series: map(byEndpoint, (es, endpoint) =>
      pages.map((page) => get(find(es, (e) => e.title === page), 'size')))
  }
  const barChartOptions = {
    height: `${pages.length * (keys(byEndpoint).length * 20)}px`,
    seriesBarDistance: 10,
    horizontalBars: true,
    reverseData: true,
    axisY: {
      offset: 100,
      scaleMinSpace: 130
    },
    axisX: {
      labelInterpolationFnc: (b) => filesize(b, {round: 0})
    }
  }

  render(
    <div className='Report'>
      <h1>Pages size report</h1>
      <h2>Data</h2>
      <div className='Data'>
        {map(byTitle, (es, t) => <Data key={`data-${t}`} title={t} entries={es}/>)}
      </div>
      <h2>All pages & endpoints</h2>
      <Chart data={barChartData} options={barChartOptions} type={'Bar'} />
    </div>,
    document.getElementById('root')
  )
}
