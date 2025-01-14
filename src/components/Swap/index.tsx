import { Trans } from '@lingui/macro'
import { OnChange } from 'components/Widget'
import { SwapInfoProvider } from 'hooks/swap/useSwapInfo'
import useSyncConvenienceFee, { FeeOptions } from 'hooks/swap/useSyncConvenienceFee'
import useSyncTokenDefaults, { TokenDefaults } from 'hooks/swap/useSyncTokenDefaults'
import { usePendingTransactions } from 'hooks/transactions'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useHasFocus from 'hooks/useHasFocus'
import useOnSupportedNetwork from 'hooks/useOnSupportedNetwork'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { displayTxHashAtom } from 'state/swap'
import { SwapTransactionInfo, Transaction, TransactionType, WrapTransactionInfo } from 'state/transactions'

import Dialog from '../Dialog'
import Header from '../Header'
import { BoundaryProvider } from '../Popover'
import Wallet from '../Wallet'
import Input from './Input'
import Output from './Output'
import ReverseButton from './ReverseButton'
import Settings from './Settings'
import { StatusDialog } from './Status'
import Toolbar from './Toolbar'
import useValidate from './useValidate'

function getTransactionFromMap(
  txs: { [hash: string]: Transaction },
  hash?: string
): Transaction<SwapTransactionInfo | WrapTransactionInfo> | undefined {
  if (hash) {
    const tx = txs[hash]
    if (tx?.info?.type === TransactionType.SWAP) {
      return tx as Transaction<SwapTransactionInfo>
    }
    if (tx?.info?.type === TransactionType.WRAP) {
      return tx as Transaction<WrapTransactionInfo>
    }
  }
  return
}

export interface SwapProps extends TokenDefaults, FeeOptions {
  onConnectWallet?: () => void
  onChange?: OnChange
}

export default function Swap(props: SwapProps) {
  useValidate(props)
  useSyncConvenienceFee(props)
  useSyncTokenDefaults(props)

  const { active, account } = useActiveWeb3React()
  const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null)

  const [displayTxHash, setDisplayTxHash] = useAtom(displayTxHashAtom)
  const pendingTxs = usePendingTransactions()
  const displayTx = getTransactionFromMap(pendingTxs, displayTxHash)

  const onSupportedNetwork = useOnSupportedNetwork()
  const isDisabled = !(active && onSupportedNetwork)

  const focused = useHasFocus(wrapper)

  return (
    <>
      <Header title={<Trans>Swap</Trans>}>
        <Wallet disabled={!active || Boolean(account)} onClick={props.onConnectWallet} />
        <Settings disabled={isDisabled} />
      </Header>
      <div ref={setWrapper}>
        <BoundaryProvider value={wrapper}>
          <SwapInfoProvider disabled={isDisabled}>
            <Input disabled={isDisabled} focused={focused} onChange={props.onChange} />
            <ReverseButton disabled={isDisabled} />
            <Output disabled={isDisabled} focused={focused} onChange={props.onChange}>
              <Toolbar />
            </Output>
          </SwapInfoProvider>
        </BoundaryProvider>
      </div>
      {displayTx && (
        <Dialog color="dialog">
          <StatusDialog tx={displayTx} onClose={() => setDisplayTxHash()} />
        </Dialog>
      )}
    </>
  )
}
