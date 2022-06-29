import { Currency, Token } from '@uniswap/sdk-core'
import { useSwapAmount, useSwapCurrency, useSwapInfo } from 'hooks/swap'
import { useCurrentMutableState as useRef } from 'hooks/useCurrentMutableState'
import { useEffect } from 'react'
import { Field } from 'state/swap'

import { useDispatchSwapValues, useSwapValues } from '../../'

export interface InputProps {
  disabled: boolean
  amount?: string
  currency?: Currency
}

export interface Props {
  input: InputProps
  output: InputProps
}

export default function SwapWrapper({ chainId, children }: { chainId: number; children: JSX.Element }) {
  const swapInfo = useSwapInfo()

  const { input, output } = useSwapValues()

  const [, updateInputAmount] = useSwapAmount(Field.INPUT)
  const [, updateInputCurrency] = useSwapCurrency(Field.INPUT)

  const [, updateSwapOutputAmount] = useSwapAmount(Field.OUTPUT)
  const [, updateSwapOutputCurrency] = useSwapCurrency(Field.OUTPUT)

  const _updateInputAmount = useRef(updateInputAmount)
  const _updateInputCurrency = useRef(updateInputCurrency)
  const _updateSwapOutputAmount = useRef(updateSwapOutputAmount)
  const _updateSwapOutputCurrency = useRef(updateSwapOutputCurrency)
  useEffect(() => {
    if (!input?.amount) return
    _updateInputAmount.current(input.amount)
  }, [input?.amount])

  useEffect(() => {
    if (!input?.currency?.address) return
    const newInputToken = new Token(chainId, input.currency.address, input.currency.decimals)
    _updateInputCurrency.current(newInputToken)
  }, [input?.currency?.address, chainId, input?.currency?.decimals])

  useEffect(() => {
    if (!output?.amount) return
    _updateSwapOutputAmount.current(output.amount)
  }, [output?.amount])

  useEffect(() => {
    if (!output?.currency?.address) return
    _updateSwapOutputCurrency.current(new Token(chainId, output.currency.address, output.currency.decimals))
  }, [output?.currency?.address, chainId, output?.currency?.decimals])

  const dispatchSwapValues = useDispatchSwapValues()

  const _dispatchSwapValues = useRef(dispatchSwapValues)
  const _swapInfo = useRef(swapInfo)
  useEffect(() => {
    _dispatchSwapValues.current({
      uniswap: {
        swapInfo: _swapInfo.current,
        inputAmountFormatted: _swapInfo.current.INPUT.amount?.toSignificant(6),
        outputAmountFormatted: _swapInfo.current.OUTPUT.amount?.toSignificant(6),
        isLoading: _swapInfo.current.trade.state === 0,
      },
      type: 'setUniswapValues',
    })
  }, [swapInfo.trade.state])

  return children
}
