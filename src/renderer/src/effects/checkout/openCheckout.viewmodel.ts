import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { SubmitHandler, useForm, Control } from 'react-hook-form'

import { CheckoutService } from '@/services/checkout.service'

interface OpenCheckoutForm {
  initialValue: number
}

interface OpenCheckoutViewModel {
  control: Control<OpenCheckoutForm, unknown, OpenCheckoutForm>
  isLoading: boolean
  onSubmit: () => Promise<void>
}

function useOpenCheckoutViewModel(): OpenCheckoutViewModel {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<OpenCheckoutForm>()
  const router = useRouter()

  const { mutateAsync: openCheckoutMutation, isPending } = useMutation({
    mutationFn: CheckoutService.openCheckout
  })

  const handleNewCheckout: SubmitHandler<OpenCheckoutForm> = async (data): Promise<void> => {
    try {
      if (isSubmitting) return

      await openCheckoutMutation({ initialValue: data.initialValue })
      toast.success('Caixa aberto com sucesso')
      await router.navigate({ to: '/orders/create' })
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error ao abrir o caixa')
    }
  }

  return {
    onSubmit: handleSubmit(handleNewCheckout),
    control,
    isLoading: isPending
  }
}

export { useOpenCheckoutViewModel }
