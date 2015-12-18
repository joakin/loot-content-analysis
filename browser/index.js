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
      <p>This report analyzes the size of <a href='https://phabricator.wikimedia.org/T120504'>different pages</a> when
        fetched from different endpoints as part of the <a href='https://www.mediawiki.org/wiki/Reading/Web/Projects/A_frontend_powered_by_Parsoid/HTML_content_research'>analysis
        of the reading team in Q3 2015/2016</a></p>
      <h3>Glossary</h3>
      <ul>
      {([
        { term: 'loot', value: 'Transformations by the reading-web-research prototype api server. Based of RestBase parsoid api, it applies the "no navboxes", "no amboxes", "no references", "no html comments" and "no data-mw attributes".' },
        { term: 'restbase', value: '<a href="https://en.wikipedia.org/api/rest_v1/page/html/Wikipedia">Parsoid endpoint exposed via restbase</a>' },
        { term: 'wikipedia', value: 'MediaWiki api using action=parse. Returns only the html.' },
        { term: 'mobileview', value: 'MediaWiki api using action=mobileview. Returns only the html.' },
        { term: 'loot-*', value: 'Transformations made by loot, only the ones specified after loot-. Example: loot-nodatamw is restbase page without data-mw attributes. loot-nodatamw-noreferences is restbase page without data-mw attributes and without references.' }
      ]).map((e) => <li><strong>{e.term}</strong>: <span dangerouslySetInnerHTML={{__html: e.value}} /></li>)}
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
