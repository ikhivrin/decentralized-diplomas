import { Address, toNano } from '@ton/core';
import { DecentralizedDiplomas } from '../wrappers/DecentralizedDiplomas';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('DecentralizedDiplomas address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const decentralizedDiplomas = provider.open(DecentralizedDiplomas.createFromAddress(address));

    ui.write('Issuing diploma...');
    ui.write(`Issuer (current address): ${address}`);

    const receiver_info = await ui.input('Receiver information (first, surname, birth date): ');
    const merit = await ui.input('Merit: ');

    await decentralizedDiplomas.sendIssue(provider.sender(), receiver_info, merit,
    {
        value: toNano('0.05'),
    });

    ui.write('Waiting for issue...');
}
