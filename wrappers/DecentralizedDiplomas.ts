import { Address, beginCell, BitReader, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type DecentralizedDiplomasConfig = {};

export function decentralizedDiplomasConfigToCell(config: DecentralizedDiplomasConfig): Cell {
    return beginCell().storeDict(null).endCell();
}

function bufferToBigInt(buffer: Buffer) {
  const bufferAsHexString = buffer.toString("hex");
  return BigInt(`0x${bufferAsHexString}`);
}

function calculateUserId(user_info: string): bigint {
    const infoCell = beginCell()
        .storeStringTail(user_info)
        .endCell();

    return bufferToBigInt(infoCell.hash());
}

export class DecentralizedDiplomas implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new DecentralizedDiplomas(address);
    }

    static createFromConfig(config: DecentralizedDiplomasConfig, code: Cell, workchain = 0) {
        const data = decentralizedDiplomasConfigToCell(config);
        const init = { code, data };
        return new DecentralizedDiplomas(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIssue(
        provider: ContractProvider,
        via: Sender,
        user_info: string,
        achievement: string,
        opts: {
            value: bigint;
        }
    ) {

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(/* operation */ 1, 32)
                .storeUint(calculateUserId(user_info), 256)
                .storeStringTail(achievement)
                .endCell(),
        });
    }

    async getDiploma(provider: ContractProvider, user_info: string) {
        const user_id = calculateUserId(user_info);

        const result = await provider.get('get_diploma', [ { type: 'int', value: user_id } ]);

        const diploma = result.stack.readCell();
        let diplomaSlice = diploma.asSlice();

        return {
            address: diplomaSlice.loadRef().asSlice().loadAddress(),
            achievement: diplomaSlice.loadStringTail()
        };
    }

}
