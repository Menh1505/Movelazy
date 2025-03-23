export interface AbiParameter {
    name: string
    type: string
    internalType?: string
    components?: AbiParameter[]
}

export interface AbiFunction {
    type: 'function'
    name: string
    inputs: AbiParameter[]
    outputs: AbiParameter[]
    stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable'
}

export interface AbiEvent {
    type: 'event'
    name: string
    inputs: AbiParameter[]
    anonymous: boolean
}

export interface AbiError {
    type: 'error'
    name: string
    inputs: AbiParameter[]
}

export type AbiItem = AbiFunction | AbiEvent | AbiError

export interface DeployedContract {
    address: string
    abi: AbiItem[]
    name: string
} 