import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Control, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'

import { CheckoutService } from '@/services/checkout.service'
import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'

interface CloseCheckoutForm {
  closingValue: number
}

interface CloseCheckoutViewModel {
  control: Control<CloseCheckoutForm>
  inputRef: React.RefObject<HTMLInputElement>
  isLoading: boolean
  isModalOpen: boolean
  isCheckoutOpen: boolean
  grandTotal: number
  closingValue: number
  difference: number
  openModal: () => void
  handleCancel: () => void
  handleConfirm: () => Promise<void>
  onSubmit: () => void
}

function useCloseCheckoutViewModel(): CloseCheckoutViewModel {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: checkoutStatus } = useQuery({
    queryKey: [CHECKOUT_QUERY_KEYS.STATUS],
    queryFn: CheckoutService.getCheckoutStatus
  })

  const { data: checkoutResume } = useQuery({
    queryKey: [CHECKOUT_QUERY_KEYS.RESUME],
    queryFn: CheckoutService.getCheckoutResume
  })

  const { handleSubmit, control, watch } = useForm<CloseCheckoutForm>({
    defaultValues: { closingValue: 0 }
  })

  const { mutateAsync: closeCheckoutMutation, isPending } = useMutation({
    mutationFn: CheckoutService.closeCheckout
  })

  const closingValue = watch('closingValue') ?? 0
  const grandTotal = checkoutResume?.grandTotal ?? 0
  const difference = closingValue - grandTotal
  const isCheckoutOpen = checkoutStatus?.isOpen ?? false

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isModalOpen) {
      inputRef.current?.focus()
    }
  }, [isModalOpen])

  const openModal = (): void => {
    setIsModalOpen(true)
  }

  const handleCancel = (): void => {
    setIsModalOpen(false)
  }

  const handleConfirm = async (): Promise<void> => {
    if (!checkoutStatus?.id) return
    try {
      await closeCheckoutMutation({ checkoutId: checkoutStatus.id, closingValue })
      setIsModalOpen(false)
      toast.success('Caixa fechado com sucesso')
      setTimeout(() => {
        router.navigate({ to: '/' })
      }, 5000)
    } catch {
      toast.error('Erro ao fechar o caixa')
    }
  }

  useHotkeys('enter', handleConfirm, { enabled: isModalOpen && !isPending, preventDefault: true })
  useHotkeys('escape', handleCancel, { enabled: isModalOpen })

  return {
    control,
    inputRef,
    isLoading: isPending,
    isModalOpen,
    isCheckoutOpen,
    grandTotal,
    closingValue,
    difference,
    openModal,
    handleCancel,
    handleConfirm,
    onSubmit: handleSubmit(openModal)
  }
}

export { useCloseCheckoutViewModel }
