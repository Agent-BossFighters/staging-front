import { useState } from "react";
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

    try {
      const response = await putData(
        `/v1/nfts/${editingBadgeId}`,
        updatedBadge,
      );

      if (response.nft) {
        setBadges((prevBadges) =>
          prevBadges.map((badgeData) =>
            badgeData.id === response.nft.id ? response.nft : badgeData,
          ),
        );
        setEditingBadgeId(null);
      }
    } catch (error) {
      console.error("Failed to update badge:", error);
    }
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
