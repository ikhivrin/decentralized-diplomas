import { Address, toNano } from '@ton/core';
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

    ui.write('Issuing diploma...');

    ui.write("Receiver info [name, surname, birth date in YYYY-MM-DD format, all separated by a single space]\n");
    const receiver_info = await ui.input("Enter receiver info: ")
    const merit = await ui.input('Merit: ');

    await decentralizedDiplomas.sendIssue(provider.sender(), receiver_info, merit,
    {
        value: toNano('0.05'),
    });

    ui.write('Issued, it will be available in a few seconds to a few minutes.');
}
