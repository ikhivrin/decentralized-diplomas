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

    const user_info = await ui.input("Enter receiver info (name, surname): ")

    const diploma = await decentralizedDiplomas.getDiploma(user_info);

    ui.write(`======= Diploma =======`);
    ui.write(`Of "${user_info}"`);
    ui.write(`Issued by ${diploma.address}`);
    ui.write(`For "${diploma.achievement}"`);
}
