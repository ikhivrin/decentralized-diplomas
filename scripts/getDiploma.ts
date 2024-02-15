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

    ui.write("Receiver info [name, surname, birth date in YYYY-MM-DD format, all separated by a single space]\n");
    const receiver_info = await ui.input("Enter receiver info: ")

    const diplomas = await decentralizedDiplomas.getDiploma(receiver_info);
    for (let i = 0; i < diplomas.length; i ++) {
        const diploma = diplomas[i]

        ui.write(`============== DIPLOMA ==============`);
        ui.write(`Received by "${receiver_info}"`);
        ui.write(`Issued by ${diploma.address}`);
        ui.write(`For "${diploma.achievement}"`);
        ui.write(`Issue time: ${diploma.issue_time}`);
        ui.write(`=====================================`);
    }

    if (diplomas.length == 0) {
        ui.write(`====================================`);
        ui.write(`========= NO DIPLOMAS YET! =========`);
        ui.write(`====================================`);
    }
}
