import { mnemonicToWalletKey } from "ton-crypto";
import { WalletContractV4 } from "ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "conduct civil mouse vault ice differ blouse cheese smile card rail give conduct memory item moon resemble decline girl where announce hurry upper struggle";  
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  const secretKeyBase64 = Buffer.from(key.secretKey).toString('base64');

  // print wallet address
  console.log(wallet.address.toString({ testOnly: true }));
  console.log('Private Key (base64):', secretKeyBase64);

}

main();