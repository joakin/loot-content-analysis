import React from 'react'
import ChartistGraph from 'react-chartist'

import '../node_modules/chartist/dist/chartist.min.css'
import './chart.css'

export default ({data, options, type}) => (
  <div className='Chart'>
    <ChartistGraph data={data} options={options} type={type} />
  </div>
)

