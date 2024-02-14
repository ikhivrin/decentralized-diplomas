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

    // ui.write('Issuing diploma...');
    // ui.write(`Issuer (current address): ${address}`);
    // await ui.input('Receiver information: ');
    // await ui.input('Merit: ');

    const user_id = BigInt(parseInt(await ui.input('Write user_id: ')));
    const value = BigInt(parseInt(await ui.input('Write value: ')));

    ui.write(`${user_id}: ${value}`);

    await decentralizedDiplomas.sendIssue(provider.sender(), user_id, value,
    {
        value: toNano('0.05'),
    });

    ui.write('Waiting for issue...');

    const counter = await decentralizedDiplomas.getDiploma();
    ui.write(`${counter}`);

}
