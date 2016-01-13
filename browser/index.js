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
import glossary from './glossary'

import './index.css'

const files = [
  {name: 'Normal', value: './output/stats.json'},
  {name: 'Gzip compression (Lvl 6)', value: './output/stats-gzip.json'}
]

getStats(files[0].value)

function getStats (fileName) {
  fetch(fileName)
    .then((resp) => {
      if (resp.status >= 400) throw new Error('Bad response from server')
      return resp.json()
    })
    .then((contents) => setTimeout(() => init(contents), 0))
    .catch((e) => console.log(e))
}

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
    height: `${pages.length * (keys(byEndpoint).length * 10)}px`,
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
      <select onChange={(e) => getStats(e.target.value)}>
        {files.map((f) => <option key={f.name} value={f.value}>{f.name}</option>)}
      </select>
      <p>This report analyzes the size of <a href='https://phabricator.wikimedia.org/T120504'>different pages</a> when
        fetched from different endpoints as part of the <a href='https://www.mediawiki.org/wiki/Reading/Web/Projects/A_frontend_powered_by_Parsoid/HTML_content_research'>analysis
        of the reading team in Q3 2015/2016</a></p>
      <h3>Glossary</h3>
      <ul>
        {glossary.map((e) => <li key={e.term}><strong>{e.term}</strong>: <span dangerouslySetInnerHTML={{__html: e.value}} /></li>)}
      </ul>
      <h2>All pages & endpoints</h2>
      <Legend reverse={barChartOptions.reverseData} labels={filter(keys(byEndpoint), endpointforBarChart)}/>
      <Chart data={barChartData} options={barChartOptions} type={'Bar'} />
      <h1>Per page reports</h1>
      <div className='PageReports'>
        {map(byTitle, (es, t) => <PageReport title={t} entries={es} key={`report-${t}`}/>)}
      </div>
    </div>,
    document.getElementById('root')
  )
}
