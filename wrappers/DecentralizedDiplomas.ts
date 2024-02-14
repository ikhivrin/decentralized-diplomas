import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type DecentralizedDiplomasConfig = {};

export function decentralizedDiplomasConfigToCell(config: DecentralizedDiplomasConfig): Cell {
    return beginCell().storeDict(null).endCell();
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
        user_id: bigint,
        value: bigint,
        opts: {
            value: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(/* operation */ 1, 32)
                .storeUint(user_id, 64)
                .storeUint(  value, 64)
                .endCell(),
        });
    }

    async getDiploma(provider: ContractProvider, user_id: bigint) {
        const result = await provider.get('get_diploma', [ { type: 'int', value: user_id } ]);
        let address = result.stack.readCell();
        return address.asSlice().loadAddress();
    }

}
