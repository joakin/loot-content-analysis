import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import fetch from 'isomorphic-fetch'
import filesize from 'filesize'
import {groupBy, map, keys, get, find, filter} from 'lodash'
import PageReport from './page-report'
import Chart from './chart'
import Legend from './legend'
import endpointforBarChart from './endpoint-for-barchart'

import './index.css'

fetch('./output/stats.json')
  .then((resp) => {
    if (resp.status >= 400) throw new Error('Bad response from server')
    return resp.json()
  })
  .then((contents) => setTimeout(() => init(contents), 0))
  .catch((e) => console.log(e))

function init (stats) {
  const byTitle = groupBy(stats, 'title')
  const byEndpoint = groupBy(stats, 'endpoint')
  const pages = keys(byTitle)

  const barChartData = {
    labels: pages,
    series: map(filter(byEndpoint, (es, endpoint) => endpointforBarChart(endpoint)), (es) =>
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
      labelInterpolationFnc: (b) => filesize(b, {round: b > 1000000 ? 2 : 0})
    }
  }

  render(
    <div className='Report'>
      <h1>Pages size report</h1>
      <h2>All pages & endpoints</h2>
      <Legend reverse={barChartOptions.reverseData} labels={filter(keys(byEndpoint), endpointforBarChart)}/>
      <Chart data={barChartData} options={barChartOptions} type={'Bar'} />
      <h2>Per page</h2>
      <div className='PageReports'>
        {map(byTitle, (es, t) => <PageReport title={t} entries={es} key={`report-${t}`}/>)}
      </div>
    </div>,
    document.getElementById('root')
  )
}