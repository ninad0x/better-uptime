'use client'

import { useState } from 'react'

type TimeRange = '24h' | '7d' | '30d'

interface TimeRangeSelectorProps {
  onRangeChange: (range: TimeRange) => void
}

export function TimeRangeSelector({ onRangeChange }: TimeRangeSelectorProps) {
  const [selected, setSelected] = useState<TimeRange>('24h')
  
  const handleChange = (range: TimeRange) => {
    setSelected(range)
    onRangeChange(range)
  }
  
  const buttonClass = (range: TimeRange) => `
    px-4 py-2 rounded-lg font-medium transition
    ${selected === range 
      ? 'bg-black text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  `
  
  return (
    <div className="flex gap-2 mb-6">
      <button onClick={() => handleChange('24h')} className={buttonClass('24h')}>
        24 Hours
      </button>
      <button onClick={() => handleChange('7d')} className={buttonClass('7d')}>
        7 Days
      </button>
      <button onClick={() => handleChange('30d')} className={buttonClass('30d')}>
        30 Days
      </button>
    </div>
  )
}