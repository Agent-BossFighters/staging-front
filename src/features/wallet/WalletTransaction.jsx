import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { ethers } from "ethers";

export default function WalletTransaction() {
  const { user } = usePrivy();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");

  const handleSendTransaction = async () => {
    if (!user || !user.wallet) {
      setError("Wallet non connecté");
      return;
    }

    setIsLoading(true);
    setError("");
    setTransactionHash("");

    try {
      const provider = await user.wallet.getEthereumProvider();
      const signer = provider.getSigner();
      
      const transaction = {
        to: recipient,
        value: ethers.utils.parseEther(amount)
      };

      const txResponse = await signer.sendTransaction(transaction);
      setTransactionHash(txResponse.hash);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 border border-border rounded-lg">
      <h2 className="text-xl font-bold">Envoyer une transaction</h2>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm">Adresse destinataire</label>
        <Input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm">Montant (ETH)</label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.01"
          type="number"
          min="0"
          step="0.001"
        />
      </div>
      
      <Button
        onClick={handleSendTransaction}
        disabled={isLoading || !recipient || !amount}
        className="mt-2"
      >
        {isLoading ? "Transaction en cours..." : "Envoyer"}
      </Button>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {transactionHash && (
        <div className="mt-2 p-2 bg-green-500/10 rounded-md">
          <p className="text-sm">Transaction réussie!</p>
          <p className="text-xs break-all">Hash: {transactionHash}</p>
        </div>
      )}
    </div>
  );
}
