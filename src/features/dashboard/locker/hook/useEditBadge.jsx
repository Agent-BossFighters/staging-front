import { useState } from "react";
import toast from "react-hot-toast";
import { putData } from "@utils/api/data";

export const useEditBadge = (setBadges) => {
  const [editingBadgeId, setEditingBadgeId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedRarity, setEditedRarity] = useState("");
  const [editedIssueId, setEditedIssueId] = useState("");
  const [editedPurchasePrice, setEditedPurchasePrice] = useState("");

  const handleEdit = (badge) => {
    setEditingBadgeId(badge.id);
    setEditedRarity(badge.rarity.name);
    setEditedName(badge);
    setEditedIssueId(badge.issueId);
    setEditedPurchasePrice(badge.purchasePrice);
  };

  const handleSave = async () => {
    const updatedBadge = {
      issueId: editedIssueId,
      itemId: editedName.itemId,
      purchasePrice: editedPurchasePrice,
    };

    toast.promise(putData(`v1/nfts/${editingBadgeId}`, updatedBadge), {
      loading: "Updating NFT...",
      success: (res) => {
        setBadges((prevBadges) =>
          prevBadges.map((badgeData) =>
            badgeData.id === editingBadgeId ? res.nft : badgeData
          )
        );
        setEditingBadgeId(null);
        return "NFT updated successfully";
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  const handleCancel = () => {
    setEditingBadgeId(null);
    setEditedRarity("");
    setEditedIssueId("");
    setEditedPurchasePrice("");
  };

  return {
    editingBadgeId,
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
