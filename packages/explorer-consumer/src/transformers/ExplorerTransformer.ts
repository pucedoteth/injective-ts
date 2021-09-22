import {
  BlockData,
  TxData,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { Transaction, Block, BlockWithTxs } from '../types/index'

export class ExplorerTransformer {
  static grpcTransactionToTransaction(tx: TxData): Transaction {
    return {
      id: tx.getId(),
      blockNumber: tx.getBlockNumber(),
      blockTimestamp: tx.getBlockTimestamp(),
      hash: tx.getHash(),
      code: tx.getCode(),
      info: tx.getInfo(),
      gasWanted: tx.getGasWanted(),
      gasUsed: tx.getGasUsed(),
      codespace: tx.getCodespace(),
      data: tx.getData(),
      events: tx.getEventsList().map((event) => ({
        type: event.getType(),
        attributes: event.getAttributesList().map((attribute) => ({
          key: attribute.getKey(),
          value: attribute.getValue(),
        })),
      })),
      messages: tx.getMessagesList().map((message) => ({
        key: message.getKey(),
        value: message.getValue(),
      })),
    }
  }

  static grpcTransactionsToTransactions(
    txs: Array<TxData>,
  ): Array<Transaction> {
    return txs.map((tx) => ExplorerTransformer.grpcTransactionToTransaction(tx))
  }

  static grpcBlockToBlock(block: BlockData): Block {
    return {
      height: block.getHeight(),
      proposer: block.getProposer(),
      moniker: block.getMoniker(),
      blockHash: block.getBlockHash(),
      parentHash: block.getParentHash(),
      numPreCommits: block.getNumPreCommits(),
      numTxs: block.getNumTxs(),
      totalTxs: block.getTotalTxs(),
      timestamp: block.getTimestamp(),
    }
  }

  static grpcBlockToBlockWithTxs(block: BlockData): BlockWithTxs {
    return {
      height: block.getHeight(),
      proposer: block.getProposer(),
      moniker: block.getMoniker(),
      blockHash: block.getBlockHash(),
      parentHash: block.getParentHash(),
      numPreCommits: block.getNumPreCommits(),
      numTxs: block.getNumTxs(),
      totalTxs: block.getTotalTxs(),
      timestamp: block.getTimestamp(),
      txs: ExplorerTransformer.grpcTransactionsToTransactions(
        block.getTxsList(),
      ),
    }
  }

  static grpcBlocksToBlocks(blocks: Array<BlockData>): Array<Block> {
    return blocks.map((block) => ExplorerTransformer.grpcBlockToBlock(block))
  }

  static grpcBlocksToBlocksWithTxs(
    blocks: Array<BlockData>,
  ): Array<BlockWithTxs> {
    return blocks.map((block) =>
      ExplorerTransformer.grpcBlockToBlockWithTxs(block),
    )
  }
}
