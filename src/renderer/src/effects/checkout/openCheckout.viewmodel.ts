import { useRef, useEffect, RefObject } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { SubmitHandler, useForm, Control } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'

import { CheckoutService } from '@/services/checkout.service'
import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'
import { HotkeyScope } from '@/lib/hotkey-scopes'
import { useSidebarNavigationContext } from '@/contexts/navigation/sidebar-navigation.context'

interface OpenCheckoutForm {
  initialValue: number
}

interface OpenCheckoutViewModel {
  control: Control<OpenCheckoutForm, unknown, OpenCheckoutForm>
  isLoading: boolean
  onSubmit: () => Promise<void>
  initialValueInputRef: RefObject<HTMLInputElement>
}

function useOpenCheckoutViewModel(): OpenCheckoutViewModel {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<OpenCheckoutForm>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { focusByPath, registerContentFocus } = useSidebarNavigationContext()

  const initialValueInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initialValueInputRef.current?.focus()
  }, [])

  useEffect(() => {
    registerContentFocus(() => initialValueInputRef.current?.focus())
    return () => registerContentFocus(null)
  }, [registerContentFocus])

  useHotkeys('escape', () => focusByPath('/checkout/open'), {
    scopes: [HotkeyScope.CONTENT],
    enableOnFormTags: true,
    preventDefault: true,
  })

  const { mutateAsync: openCheckoutMutation, isPending } = useMutation({
    mutationFn: CheckoutService.openCheckout,
  })

  const handleNewCheckout: SubmitHandler<OpenCheckoutForm> = async (data): Promise<void> => {
    try {
      if (isSubmitting) return

      await openCheckoutMutation({ initialValue: data.initialValue })
      await queryClient.invalidateQueries({ queryKey: [CHECKOUT_QUERY_KEYS.STATUS] })
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
    isLoading: isPending,
    initialValueInputRef,
  }
}

export { useOpenCheckoutViewModel }
