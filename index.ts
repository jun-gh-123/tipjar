import "@mysten/dapp-kit-core/web";
import { createDAppKit } from "@mysten/dapp-kit-core";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";
import { RECIPIENT, CONFIG, SUI, TOKENS } from "./config";

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
const tipTokenSelect = document.getElementById("tipToken");
const submitTipButton = document.getElementById("submitTip");

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
  customInputField.id = "customTipAmountInput";

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

function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");

  if (fraction.length > decimals) {
    throw new Error(`Too many decimal places. Maximum is ${decimals}`);
  }

  return (
    BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt(fraction.padEnd(decimals, "0"))
  );
}

async function sendToken(senderAddress, token, amountRaw) {
  const network = dAppKit.stores.$currentNetwork.get();

  if (!network) {
    return;
  }

  const tokenAddress = token.address[network];
  const amount = toBaseUnits(amountRaw, token.decimals);

  const tx = new Transaction();
  tx.setSender(senderAddress);

  tx.moveCall({
    target: "0x2::balance::send_funds",
    typeArguments: [tokenAddress],
    arguments: [
      tx.balance({
        type: tokenAddress,
        balance: amount,
      }),
      tx.pure.address(RECIPIENT),
    ],
  });

  const result = await dAppKit.signAndExecuteTransaction({
    transaction: tx,
  });

  if (result.FailedTransaction) {
    throw new Error(
      `Transaction failed: ${result.FailedTransaction.status.error?.message}`
    );
  }
  console.log("Transaction digest:", result.Transaction.digest);
}

function submitTip() {
  const connection = dAppKit.stores.$connection.get();
  const senderAddress = connection?.account?.address;

  if (!senderAddress) {
    return;
  }

  const selectedTipAmountRadio = document.querySelector(
    'input[name="tipAmount"]:checked'
  );
  let tipAmountRaw = selectedTipAmountRadio.value;
  if (tipAmountRaw === "custom") {
    tipAmountRaw = document.getElementById("customTipAmountInput").value;
  }

  const tokenKey = tipTokenSelect.value;
  const token = TOKENS[tokenKey];

  sendToken(senderAddress, token, tipAmountRaw);
}

const unsubscribe = dAppKit.stores.$connection.subscribe((connection) => {
  toggleTipUI();
});

addTipAmounts([0.01, 0.05, 0.1, 0.25, 1, 5]);
toggleTipUI();

submitTipButton.addEventListener("click", submitTip);
