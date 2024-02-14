import { toNano } from '@ton/core';
import { DecentralizedDiplomas } from '../wrappers/DecentralizedDiplomas';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const decentralizedDiplomas = provider.open(
        DecentralizedDiplomas.createFromConfig({},
            await compile('DecentralizedDiplomas')
        )
    );

    await decentralizedDiplomas.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(decentralizedDiplomas.address);
}
