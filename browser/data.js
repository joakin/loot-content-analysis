import React from 'react'
import filesize from 'filesize'

import './data.css'

export default ({title, entries}) => (
  <div className='Data'>
    <table>
      <caption>{title}</caption>
      <thead>
        <tr>
          <th>Endpoint</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
      {entries.map((e) => (
        <tr key={`data-row-${title}-${e.endpoint}`}>
          <td>{e.endpoint}</td>
          <td>{filesize(e.size)}</td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>
)
