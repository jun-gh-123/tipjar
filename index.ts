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

const tipUI = document.getElementById("tipUI");
const tipAmounts = document.getElementById("tipAmounts");

function toggleTipUI() {
  const connection = dAppKit.stores.$connection.get();
  const connected =
    connection.isConnected && connection.wallet && connection.account;
  tipUI.hidden = !connected;
}

function addTipAmounts(amounts) {
  for (let amt of amounts) {
    const id = `tip-${amt}`;
    let container = document.createElement("div");

    let label = document.createElement("label");
    label.textContent = amt;
    label.htmlFor = id;

    let input = document.createElement("input");
    input.type = "radio";
    input.name = "tipAmount";
    input.value = amt;
    input.id = id;

    container.append(input);
    container.append(label);

    tipAmounts.append(container);
  }

  // add custom field
  const customId = "tip-custom";
  let container = document.createElement("div");

  let customInputField = document.createElement("input");
  customInputField.type = "number";
  customInputField.placeholder = "Enter custom amount";

  let customInputRadio = document.createElement("input");
  customInputRadio.type = "radio";
  customInputRadio.name = "tipAmount";
  customInputRadio.value = "custom";
  customInputRadio.id = customId;

  customInputField.addEventListener("click", () => {
    customInputRadio.checked = true;
  });

  container.append(customInputRadio);
  container.append(customInputField);

  tipAmounts.append(container);
}

const unsubscribe = dAppKit.stores.$connection.subscribe((connection) => {
  toggleTipUI();
});

addTipAmounts([0.01, 0.05, 0.1, 0.25, 1, 5]);
toggleTipUI();
