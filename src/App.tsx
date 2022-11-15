import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const LIST_CHAIN_IDS: { [key: string]: string } = {
  "0x1": "Ethereum Main Network (Mainnet)",
  "0x3": "Ropsten Test Network",
  "0x4": "Rinkeby Test Network",
  "0x38": "	Binance Smart Chain Main Network",
};

async function requestAccount(callback: Dispatch<SetStateAction<string>>) {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      callback(accounts[0]);
    } catch (error) {
      console.log("Error connecting...");
    }
  } else {
    window.open("https://metamask.io/download/");
  }
}

function App() {
  const [wallet, setWallet] = useState<string>("");

  const [network, setNetwork] = useState<string>("");

  const connectMetamask = useCallback(() => {
    requestAccount(setWallet);
  }, []);

  const renderWalletAddress = useMemo(() => {
    if (wallet === "") return null;
    return (
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        <b>Wallet Address:</b> {wallet}
      </p>
    );
  }, [wallet]);

  const renderNetWork = useMemo(() => {
    if (network === "") return null;
    return (
      <p>
        <b>NetWork:</b> {network}
      </p>
    );
  }, [network]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (_chainId: string) => {
        setNetwork(LIST_CHAIN_IDS[_chainId] ?? "Network not supported!");
        connectMetamask();
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={connectMetamask}
      >
        Connect to Metamask
      </button>

      {renderWalletAddress}

      {renderNetWork}
      
    </div>
  );
}

export default App;
