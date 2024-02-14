import { Address } from '@ton/core';
import { DecentralizedDiplomas } from '../wrappers/DecentralizedDiplomas';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('DecentralizedDiplomas address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const decentralizedDiplomas = provider.open(DecentralizedDiplomas.createFromAddress(address));

    const counter = await decentralizedDiplomas.getDiploma();
    ui.write(`Counter: ${counter}`);
}
