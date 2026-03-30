import { ReactNode } from 'react'

interface BoxValueProps {
  title: string
  value: string
  className?: string
}

function BoxValue({ title, value, className }: BoxValueProps): ReactNode {
  return (
    <div className={className}>
      <h5>{title}</h5>
      <p>
        <strong>{value}</strong>
      </p>
    </div>
  )
}

export { BoxValue }
