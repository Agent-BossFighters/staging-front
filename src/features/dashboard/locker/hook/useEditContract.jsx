import { useState } from "react";
import toast from "react-hot-toast";
import { putData } from "@utils/api/data";

export const useEditContract = (setContracts) => {
  const [editingContractId, setEditingContractId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedRarity, setEditedRarity] = useState("");
  const [editedIssueId, setEditedIssueId] = useState("");
  const [editedPurchasePrice, setEditedPurchasePrice] = useState("");

  const handleEdit = (contract) => {
    setEditingContractId(contract.id);
    setEditedRarity(contract.rarity.name);
    setEditedName(contract);
    setEditedIssueId(contract.issueId);
    setEditedPurchasePrice(contract.purchasePrice);
  };

  const handleSave = async () => {
    const updatedContract = {
      issueId: editedIssueId,
      itemId: editedName.itemId,
      purchasePrice: editedPurchasePrice,
    };

    toast.promise(putData(`v1/nfts/${editingContractId}`, updatedContract), {
      loading: "Updating NFT...",
      success: (response) => {
        if (response.nft) {
          setContracts((prevContracts) =>
            prevContracts.map((contractData) =>
              contractData.id === response.nft.id ? response.nft : contractData,
            ),
          );
          setEditingContractId(null);
          return "NFT updated successfully";
        }
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  const handleCancel = () => {
    setEditingContractId(null);
    setEditedRarity("");
    setEditedIssueId("");
    setEditedPurchasePrice("");
  };

  return {
    editingContractId,
    editedRarity,
    editedName,
    editedIssueId,
    editedPurchasePrice,
    setEditedRarity,
    setEditedName,
    setEditedIssueId,
    setEditedPurchasePrice,
    handleEdit,
    handleSave,
    handleCancel,
  };
};
