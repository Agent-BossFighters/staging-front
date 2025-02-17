import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@ui/table";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Plus } from "lucide-react";
import ActionsTable from "./actions-table";
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import { postData, deleteData } from "@utils/api/data";
import {
  handleSelectRarityBadges,
  handleSelectRarityBadgeForEdit,
  getRarityOrder,
} from "@shared/hook/rarity";
import { useBadges } from "./hook/useBadges";
import { useEditBadge } from "./hook/useEditBadge";
import { BadgeCommon } from "@img/index";
import { useUserPreference } from "@context/userPreference.context";

export default function LockerBadges() {
  const { badges, setBadges, loading, setLoading, fetchMyBadges } = useBadges();
  const {
    editingBadgeId,
    editedRarity,
    editedName,
    editedIssueId,
    editedPurchasePrice,
    setEditedName,
    setEditedRarity,
    setEditedIssueId,
    setEditedPurchasePrice,
    handleEdit,
    handleSave,
    handleCancel,
  } = useEditBadge(setBadges);
  const [issueId, setIssueId] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [selectedBadge, setSelectedBadge] = useState(null);
  const { maxRarity } = useUserPreference();

  useEffect(() => {
    fetchMyBadges();
  }, []);

  const filteredBadges = badges.filter(
    (badge) => getRarityOrder(badge.rarity.name) <= getRarityOrder(maxRarity),
  );

  const handleSubmit = async () => {
    if (!selectedBadge || !issueId || !purchasePrice) {
      console.error("fill all fields");
      return;
    }
    const payload = {
      nft: {
        itemId: selectedBadge.id,
        issueId: issueId.trim(),
        purchasePrice: purchasePrice.trim(),
      },
    };
    setLoading(true);
    const response = await postData("/v1/nfts/create", payload);
    if (response && response.nft) {
      setBadges((prevBadges) => [...prevBadges, response.nft]);
      setIssueId("");
      setPurchasePrice("");
      setSelectedBadge(null);
    }
    setLoading(false);
  };

  const handleDelete = async (badgeId) => {
    const response = await deleteData(`/v1/nfts/${badgeId}`);
    if (response) {
      setBadges((prevBadges) =>
        prevBadges.filter((badgeData) => badgeData.id !== badgeId),
      );
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold py-2 flex gap-3 items-center">
        <img src={BadgeCommon} alt="Badge" className="w-10 h-10" />
        BADGE(S)
      </h2>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
            <TableHead>RARITY</TableHead>
            <TableHead>ITEM</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>PURCHASE PRICE</TableHead>
            <TableHead>ACTION(S)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto">
          {filteredBadges.length > 0 ? (
            filteredBadges.map((badge, index) => {
              const isEditing = badge.id === editingBadgeId;

              return (
                <TableRow key={index} className="">
                  <TableCell style={{ color: badge.rarity.color }}>
                    {isEditing ? (
                      <SelectSlot
                        onSelectRarity={(rarity) => {
                          setEditedRarity(rarity);
                          handleSelectRarityBadgeForEdit(setEditedName, rarity);
                        }}
                        selectedRarity={editedRarity}
                        rounded={true}
                      />
                    ) : (
                      badge.rarity.name
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? <p>{editedName.name}</p> : badge.name}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedIssueId}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );
                        }}
                        className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setEditedIssueId(e.target.value)}
                      />
                    ) : (
                      badge.issueId
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedPurchasePrice}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );
                        }}
                        className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setEditedPurchasePrice(e.target.value)}
                      />
                    ) : (
                      badge.purchasePrice
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <ActionsTable
                      data={badge}
                      onEdit={handleEdit}
                      onDelete={() => handleDelete(badge.id)}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      isEditing={isEditing}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No badge found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell>
              <SelectSlot
                onSelectRarity={(rarity) =>
                  handleSelectRarityBadges(setSelectedBadge, rarity)
                }
                rounded={true}
              />
            </TableCell>
            <TableCell>{selectedBadge ? selectedBadge.name : ""}</TableCell>
            <TableCell>
              <Input
                type="number"
                placeholder="ID"
                inputMode="numeric"
                value={issueId}
                onChange={(e) => setIssueId(e.target.value)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                placeholder="Price"
                inputMode="numeric"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </TableCell>
            <TableCell className="flex items-center">
              <Button
                variant="transparent"
                onClick={handleSubmit}
                className="p-0 hover:text-primary hover:scale-150"
              >
                <Plus />
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
