
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address, beginCell, toNano } from "@ton/ton";
import ChildContract from "./ChildContract";
import { Constants } from "./Constants";
import ParentContract from "./ParentContract";

export async function sendStringMessageAsOwner(message: string) {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    // open wallet v4 (notice the correct wallet version here)
    const key = await mnemonicToWalletKey(Constants.mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log("wallet is not deployed");
    }

    // open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();

    // open Counter instance by address
    const counterAddress = Address.parse(Constants.addressString);
    const contract = new ChildContract(counterAddress);
    const counterContract = client.open(contract);

    // send the increment transaction
    await counterContract.sendTextMessage(walletSender, message);

    // wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
}

export function createTransactionForStringMessage(message: string, amount: string, address: string) {
    const contractAddress = Address.parse(address);
    const newAmount = amount.replace(/,/g, ".")
    const body = beginCell()
        .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
        .storeStringTail(message) // write our text comment
        .endCell();


    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
            {
                address: contractAddress.toRawString(),
                amount: toNano(newAmount).toString(),
                payload: body.toBoc().toString("base64") // payload with comment in body
            }
        ]
    }
    return myTransaction
}

export async function finishBet(addressString: string) {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    // open wallet v4 (notice the correct wallet version here)
    const key = await mnemonicToWalletKey(Constants.mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log("wallet is not deployed");
    }

    // open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();

    // open Counter instance by address
    const counterAddress = Address.parse(addressString);
    const contract = new ChildContract(counterAddress);
    const counterContract = client.open(contract);

    // send the increment transaction
    await counterContract.sendFinishBet(walletSender);

    // wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
}

export async function createBet(title: string, source: string, optionA: string, optionB: string, imageUrl: string) {
    // initialize ton rpc client on testnet
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    // open wallet v4 (notice the correct wallet version here)
    const key = await mnemonicToWalletKey(Constants.mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log("wallet is not deployed");
    }

    // open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();

    // open Counter instance by address
    const counterAddress = Address.parse(Constants.addressString);
    const contract = new ParentContract(counterAddress);
    const parentContract = client.open(contract);

    // send the increment transaction
    await parentContract.sendNewBet(walletSender, { $$type: "BetInfoInit", title: title, source: source, bet_a_name: optionA, bet_b_name: optionB, image: imageUrl });

    // wait until confirmed
    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




