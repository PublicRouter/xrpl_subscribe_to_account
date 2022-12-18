const xrpl = require('xrpl')
require('dotenv').config()


async function main() {
    // Set the address of the wallet to monitor
    const ADDRESS = process.env.WALLET_TWO_R

    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    const stream = await client.request({
        command: 'subscribe',
        accounts: [ADDRESS]

    });

    console.log("This is my stream response: ", stream);

    client.on('transaction', (tx) => {
        if (tx.transaction.TransactionType === 'Payment' && tx.transaction.Destination === ADDRESS) {
            console.log('Moniored Address Received a Payment!');
            console.log(`
                Payment Info:
                Transaction: ${tx.transaction.TransactionType},
                Payment Status: ${tx.meta.TransactionResult},
                Sender: ${tx.transaction.Account},
                Receiver: ${tx.transaction.Destination},
                Amount: ${tx.transaction.Amount / 1000000} XRP
            `)

        };
    });

}

main();