import { keccak256 } from 'ethereumjs-util';
import { TypedDataUtils } from 'eth-sig-util';

export interface RelayerDomain {
  chainId: number;
  verifyingContract: string;
}

export interface TxMessage {
  signer: string;
  to: string;
  value: number;
  data: string;
  nonce: string;
}

export interface ExecuteTypedData {
  types: {
    EIP712Domain: EIP712Type,
    TxMessage: EIP712Type,
  };
  message: TxMessage;
  primaryType: string;
  domain: RelayerDomain;
}

type EIP712Type = Array<{ name: string, type: string }>;

/* EIP712 type definitions */

const eip712DomainType = [
  { name: 'verifyingContract', type: 'address' },
  { name: 'chainId', type: 'uint256' },
];

const executeTxType = [
  { name: 'signer', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'data', type: 'bytes' },
  { name: 'nonce', type: 'uint256' },
];

export function hashMessage<TMessage>(
  domain: RelayerDomain, typeName: string, type: EIP712Type, message: TMessage,
): Buffer {
  const encodedDomain = TypedDataUtils.encodeData(
    'EIP712Domain',
    domain,
    { EIP712Domain: eip712DomainType },
  );
  const hashedDomain = keccak256(encodedDomain);

  const messageTypes: Record<string, EIP712Type> = {};
  messageTypes[typeName] = type;

  const encodedMessage = TypedDataUtils.encodeData(
    typeName,
    message as any,
    messageTypes,
  );
  const hashedMessage = keccak256(encodedMessage);

  return keccak256(
    Buffer.concat([
      Buffer.from('1901', 'hex'),
      hashedDomain,
      hashedMessage,
    ]),
  );
}

export function executeMessageTypedData(domain: RelayerDomain, message: TxMessage): ExecuteTypedData {
  return {
    types: {
      EIP712Domain: eip712DomainType,
      TxMessage: executeTxType,
    },
    primaryType: 'TxMessage',
    domain,
    message,
  };
}

export function executeMessageHash(domain: RelayerDomain, message: TxMessage): Buffer {
  return hashMessage(domain, 'TxMessage', executeTxType, message);
}
