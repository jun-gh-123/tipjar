import "@mysten/dapp-kit-core/web";
import { createDAppKit } from "@mysten/dapp-kit-core";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { RECIPIENT, CONFIG } from "./config";

const dAppKit = createDAppKit({
  networks: ["testnet", "mainnet"],
  defaultNetwork: "testnet",
  createClient(network) {
    return new SuiGrpcClient({
      network,
      baseUrl: CONFIG[network].baseUrl,
    });
  },
});

const button = document.querySelector("mysten-dapp-kit-connect-button");

button.instance = dAppKit;
