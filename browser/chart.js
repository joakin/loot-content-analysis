import React from 'react'
import ChartistGraph from 'react-chartist'

import '../node_modules/chartist/dist/chartist.min.css'

export default ({data, options, type}) => (
  <ChartistGraph data={data} options={options} type={type} />
)

