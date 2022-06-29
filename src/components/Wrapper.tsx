import { JsonRpcProvider } from '@ethersproject/providers'
import { TokenInfo } from '@uniswap/token-lists'
import { Provider as Eip1193Provider } from '@web3-react/types'
// eslint-disable-next-line no-restricted-imports
import { ethers } from 'ethers'
import { SwapInfo } from 'hooks/swap/useSwapInfo'
import { TransactionsUpdater } from 'hooks/transactions'
import { ActiveWeb3Provider } from 'hooks/useActiveWeb3React'
import { BlockNumberProvider } from 'hooks/useBlockNumber'
import { TokenListProvider } from 'hooks/useTokenList'
import { Provider as AtomProvider } from 'jotai'
import { PropsWithChildren, StrictMode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { MulticallUpdater, store as multicallStore } from 'state/multicall'

import ErrorBoundary, { ErrorHandler } from './Error/ErrorBoundary'

export type OnChange = (e: SwapInfo) => void
export type WrapperProps = {
  accounts?: string[]
  provider?: Eip1193Provider | JsonRpcProvider
  jsonRpcEndpoint?: string | JsonRpcProvider
  tokenList?: string | TokenInfo[]
  onError?: ErrorHandler
}

const getCustomProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/14c73ecdbcaa464585aa7c438fdf6a77')
  const jsonRpcEndpoint = 'https://rinkeby.infura.io/v3/14c73ecdbcaa464585aa7c438fdf6a77'

  return { provider, jsonRpcEndpoint }
}

export default function Wrapper(props: PropsWithChildren<WrapperProps>) {
  const { children, onError } = props
  const { provider, jsonRpcEndpoint } = getCustomProvider()
  return (
    <StrictMode>
      <ErrorBoundary onError={onError}>
        <ReduxProvider store={multicallStore}>
          <AtomProvider>
            <ActiveWeb3Provider
              provider={provider}
              jsonRpcEndpoint={jsonRpcEndpoint}
              accounts={['0xf08fD75cCed9Eb65cff7451291Bf41e91c8457eD']}
            >
              <BlockNumberProvider>
                <MulticallUpdater />
                <TransactionsUpdater />
                <TokenListProvider list={props.tokenList}>{children}</TokenListProvider>
              </BlockNumberProvider>
            </ActiveWeb3Provider>
          </AtomProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}
