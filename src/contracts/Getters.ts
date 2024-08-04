import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import ChildContract, { Bet } from "./ChildContract";
import { Constants } from "./Constants";
import ParentContract from "./ParentContract";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { Add } from "@mui/icons-material";

async function getChildContract(addressString: string) {
    const contractAddress = Address.parse(addressString);
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });
    const contract = new ChildContract(contractAddress);
    const child = client.open(contract);
    return child
}

async function getParentContract() {
    const contractAddress = Address.parse(Constants.addressString);
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });
    const contract = new ParentContract(contractAddress);
    const parent = client.open(contract);
    return parent
}
export async function fetchContracts() {
    const contract = await getParentContract();
    const addressMap = await contract.getGetAllAddresses();
    console.log("fetchContracts: ", addressMap.size.toString());
    return addressMap.values()
}

export async function fetchBetsByAddress(address: string) {
    const contract = await getParentContract();
    const map = await contract.getGetUserBets(Address.parse(address));
    map.values().forEach(element => {
        console.log("address: ", element.betContract.toString());
    });
    return map
}

export async function fetchContractsWithData() {
    const contract = await getParentContract();
    const addressMap = await contract.getGetAllAddresses();

    let result: Bet[] = [];

    for (const address of addressMap.values()) {
        const betInfo = await getBetInfo(address.toString())
        result.push({ $$type: "Bet", betInfo: betInfo, address: address.toString() })
    }

    return result
}

export async function fetchContractByAddress(address: string): Promise<Bet> {
    const betInfo = await getBetInfo(address)
    const result: Bet = { $$type: "Bet", betInfo: betInfo, address: address }
    return result
}

export async function fetchMyBets(address: string) {
    const contract = await getParentContract();
    const addressMap = await contract.getGetUserBets(Address.parse(address));
    let result: Bet[] = [];

    for (const address of addressMap.values()) {
        const betInfo = await getBetInfo(address.betContract.toString())
        result.push({ $$type: "Bet", betInfo: betInfo, address: address.toString() })
    }

    return result
}

export async function getIsFinished(address: string) {
    const contract = await getChildContract(address);
    const isFinished = await contract.getIsFinalized();
    // console.log("getIsFinished:", isFinished.toString());
    return isFinished
}

export async function getBetInfo(address: string) {
    const contract = await getChildContract(address);

    const betInfo = await contract.getGetBetInfo();


    console.log("total_bet_a:", betInfo.total_bet_a);
    console.log("total_bet_b:", betInfo.total_bet_b);

    return betInfo
}