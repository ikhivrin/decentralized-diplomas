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

    const diplomas = await decentralizedDiplomas.getDiploma(user_info);
    for (let i = 0; i < diplomas.length; i ++) {
        const diploma = diplomas[i]

        ui.write(`============== Diploma ==============`);
        ui.write(`Received by "${user_info}"`);
        ui.write(`Issued by ${diploma.address}`);
        ui.write(`For "${diploma.achievement}"`);
        ui.write(`Issue time: ${diploma.issue_time}`);
        ui.write(`=====================================`);
    }
}
