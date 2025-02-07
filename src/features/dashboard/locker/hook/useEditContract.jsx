import { useState } from "react";
import { putData } from "@utils/api/data";

export const useEditContract = (setContracts) => {
  const [editingContractId, setEditingContractId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedRarity, setEditedRarity] = useState("");
  const [editedIssueId, setEditedIssueId] = useState("");
  const [editedPurchasePrice, setEditedPurchasePrice] = useState("");

  const handleEdit = (contract) => {
    console.log("editing contract", contract);
    console.log("editing contract name", contract.name);
    setEditingContractId(contract.id);
    setEditedRarity(contract.rarity.name);
    setEditedName(contract);
    setEditedIssueId(contract.issueId);
    setEditedPurchasePrice(contract.purchasePrice);
  };

  const handleSave = async () => {
    console.log("edited name", editedName);
    const updatedContract = {
      issueId: editedIssueId,
      itemId: editedName.itemId,
      purchasePrice: editedPurchasePrice,
    };

    try {
      const response = await putData(
        `/v1/nfts/${editingContractId}`,
        updatedContract,
      );

      if (response.nft) {
        setContracts((prevContracts) =>
          prevContracts.map((contractData) =>
            contractData.id === response.nft.id ? response.nft : contractData,
          ),
        );
        setEditingContractId(null);
      }
    } catch (error) {
      console.error("Failed to update contract:", error);
    }
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
