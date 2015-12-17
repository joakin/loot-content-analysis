import React from 'react'

import './legend.css'

export default ({labels, reverse}) => (
  <div className='Legend'>
    {labels.map((label, i) =>
      <span key={label}>
        <span className={`Legend-marker ct-bg-${
          reverse ? labels.length - i : i + 1
        }`}/>
        {label}
      </span>
    )}
  </div>
)
