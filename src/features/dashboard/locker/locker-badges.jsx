import { useState, useEffect } from "react";
import toast from "react-hot-toast";
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
import { NumericInput } from "@ui/numeric-input";
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
import BadgeSkeleton from "./skeletons/BadgeSkeleton";
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
    (badge) => getRarityOrder(badge.rarity.name) <= getRarityOrder(maxRarity)
  );

  const handleSubmit = async () => {
    const missingFields = [];
    if (!selectedBadge) missingFields.push("Rarity");
    if (!issueId) missingFields.push("ID");
    if (!purchasePrice) missingFields.push("Purchase Price");
    if (missingFields.length > 0) {
      toast.error(
        `Missing fields: ${missingFields.join(", ")}. Please fill all fields.`
      );
    }
    const payload = {
      nft: {
        itemId: selectedBadge.id,
        issueId: issueId.trim(),
        purchasePrice: purchasePrice.trim(),
      },
    };
    setLoading(true);

    toast
      .promise(postData("v1/nfts/create", payload), {
        loading: "Creating NFT...",
        success: (res) => {
          setBadges((prevBadges) => [...prevBadges, res.nft]);
          setIssueId("");
          setPurchasePrice("");
          setSelectedBadge(null);
          return "NFT created successfully";
        },
        error: (err) => {
          return `Error: ${err.message}`;
        },
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (badgeId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this badge?"
    );
    if (!confirm) return;
    toast.promise(deleteData(`v1/nfts/${badgeId}`), {
      loading: "Deleting NFT...",
      success: () => {
        setBadges((prevBadges) =>
          prevBadges.filter((badgeData) => badgeData.id !== badgeId)
        );
        return "Showrunner contract deleted successfully";
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  if (loading) {
    return <BadgeSkeleton />;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold py-2 flex gap-3 items-center">
        <img src={BadgeCommon} alt="Badge" className="w-10 h-10" />
        BADGE(S)
      </h2>
      <Table className="">
        <TableCaption>
          List of your badges
        </TableCaption>
        <TableHeader>
          <TableRow>
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
                  <TableCell>
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
                      <p
                        className="border-2 rounded-full text-center"
                        style={{ borderColor: badge.rarity.color }}
                      >
                        {badge.rarity.name}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? <p>{editedName.name}</p> : badge.name}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <NumericInput
                        placeholder="ID"
                        value={editedIssueId}
                        onChange={setEditedIssueId}
                        className="w-1/2"
                      />
                    ) : (
                      badge.issueId
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <NumericInput
                        placeholder="Purchase Price"
                        value={editedPurchasePrice}
                        onChange={setEditedPurchasePrice}
                        className="w-1/2"
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
              <NumericInput
                placeholder="ID"
                value={issueId}
                onChange={setIssueId}
                className="w-1/2"
              />
            </TableCell>
            <TableCell>
              <NumericInput
                placeholder="Purchase Price"
                value={purchasePrice}
                onChange={setPurchasePrice}
                className="w-1/2"
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