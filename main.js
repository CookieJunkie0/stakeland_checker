const fs = require('fs');

async function checkStaked(wallet) {
    try {
        const response = await fetch(`https://memestaking-api.stakeland.com/wallet/info/${wallet}`);
        const data = await response.json();
        return data
    } catch(e) {return {success: false, err: e}}
}

async function main() {
    const wallets = fs.readFileSync('./wallets.txt', 'utf-8').split('\n');
    console.log(`Checking ${wallets.length} wallets...`);

    for(i=0;i<wallets.length;i++) {
        const wallet = wallets[i];
        const result = await checkStaked(wallet);
        const isEmpty = result?.rewards?.length == 0? true : false;
        console.log(`[${i+1}/${wallets.length}] ${wallet} - ${!isEmpty ? result?.rewards[0]?.amount/1000000000000000000 : 0} MEME`,);

        if(!isEmpty) fs.appendFileSync('./rewarded.txt', `${wallet}:${result?.rewards[0]?.amount/1000000000000000000}\n`);
    }
}

main()