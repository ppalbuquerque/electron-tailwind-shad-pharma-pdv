import { ReactNode } from 'react'

interface BoxValueProps {
  title: string
  value: string
}

function BoxValue({ title, value }: BoxValueProps): ReactNode {
  return (
    <div>
      <h5>{title}</h5>
      <p>
        <strong>R$ 20,00</strong>
      </p>
    </div>
  )
}

export { BoxValue }
