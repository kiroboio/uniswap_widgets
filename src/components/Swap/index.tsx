import { SwapInfoProvider } from 'hooks/swap/useSwapInfo'
import useSyncConvenienceFee, { FeeOptions } from 'hooks/swap/useSyncConvenienceFee'
import useSyncTokenDefaults, { TokenDefaults } from 'hooks/swap/useSyncTokenDefaults'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useOnSupportedNetwork from 'hooks/useOnSupportedNetwork'

import SwapWrapper from './SwapWrapper'
import useValidate from './useValidate'

export interface SwapToken {
  address: string
  decimals: number
}

export interface SwapField {
  amount?: string
  currency?: SwapToken
}
export interface SwapProps extends TokenDefaults, FeeOptions {
  chainId: number
  children: JSX.Element
}

// const getSwapValuesTest = () => (
//   <>
//     <button
//       onClick={() => {
//         dispatchSwapValues({
//           type: 'setUniswapInput',
//           input: {
//             amount: Math.random().toString(),
//             currency: {
//               address: '0xb678e95f83af08e7598ec21533f7585e83272799',
//               decimals: 18,
//             },
//           },
//         })

//         dispatchSwapValues({
//           type: 'setUniswapOutput',
//           output: {
//             currency: {
//               address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
//               decimals: 18,
//             },
//           },
//         })
//       }}
//     >
//       test swap
//     </button>
//     <button
//       onClick={() => {
//         dispatchSwapValues({
//           type: 'setUniswapInput',
//           input: {
//             currency: {
//               address: '0xb678e95f83af08e7598ec21533f7585e83272799',
//               decimals: 18,
//             },
//           },
//         })

//         dispatchSwapValues({
//           type: 'setUniswapOutput',
//           output: {
//             amount: Math.random().toString(),
//             currency: {
//               address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
//               decimals: 18,
//             },
//           },
//         })
//       }}
//     >
//       test swap output
//     </button>
//   </>
// )

export default function Swap(props: SwapProps) {
  useValidate(props)
  useSyncConvenienceFee(props)
  useSyncTokenDefaults(props)

  const { chainId } = props

  const { active } = useActiveWeb3React()
  const onSupportedNetwork = useOnSupportedNetwork()
  const isDisabled = !(active && onSupportedNetwork)

  return (
    <SwapInfoProvider disabled={isDisabled}>
      <SwapWrapper chainId={chainId}>{props.children}</SwapWrapper>
    </SwapInfoProvider>
  )
}
