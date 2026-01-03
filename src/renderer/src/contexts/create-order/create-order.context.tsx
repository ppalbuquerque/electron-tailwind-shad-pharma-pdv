/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, use, ReactNode } from 'react'

import { Medication } from '@/types/medication'
import { OrderItem } from '@/types/orderItem'

type Action =
  | { type: 'addItem'; item: OrderItem }
  | { type: 'removeItem' }
  | { type: 'selectOrderItem'; item: Medication }
type Dispatch = (action: Action) => void
type State = {
  items: OrderItem[]
  selectedMedication: Medication | undefined
}

interface CreateOrderContext {
  state: State
  dispatch: Dispatch
}

const CreateOrderContext = createContext<CreateOrderContext | undefined>(undefined)

const initialStateValue: State = {
  items: [],
  selectedMedication: undefined
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'addItem': {
      return { ...state, items: [...state.items, action.item] }
    }
    case 'selectOrderItem': {
      return { ...state, selectedMedication: action.item }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function CreateOrderProvider({ children }: { children: ReactNode }): ReactNode {
  const [state, dispatch] = useReducer(reducer, initialStateValue)

  const value = { state, dispatch }

  return <CreateOrderContext.Provider value={value}>{children}</CreateOrderContext.Provider>
}

function useCreateOrder(): CreateOrderContext {
  const context = use(CreateOrderContext)
  if (context === undefined) {
    throw new Error('useCreateOrder must be used within a CreateOrderProvider')
  }
  return context
}

export { CreateOrderProvider, useCreateOrder }
