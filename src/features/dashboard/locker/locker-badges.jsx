import { useState, useEffect, useRef } from "react";
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
import { useUserPreference } from "@context/userPreference.context";
import BadgeSkeleton from "./skeletons/BadgeSkeleton";
import { formatPrice, formatId } from "@utils/formatters";
import { useTableScroll } from "@shared/hook/useTableScroll";
import ScrollControls from "@ui/scroll-controls";

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

  const {
    tableRef,
    visibleItems: visibleBadges,
    showScrollMessage,
    isAtStart,
    isAtEnd,
    handleMouseEnter,
    handleMouseLeave,
    startScrollingUp,
    stopScrollingUp,
    startScrollingDown,
    stopScrollingDown,
  } = useTableScroll({
    items: filteredBadges,
    visibleRowsCount: 8,
  });

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
    <div className="flex flex-col w-full xl:w-[60%] gap-5">
      <div className="pt-2">
        <div
          ref={tableRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Table className="w-full">
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="py-0 px-2">RARITY</TableHead>
                <TableHead className="py-0 px-2">ITEM</TableHead>
                <TableHead className="py-0 px-2">ID</TableHead>
                <TableHead className="py-0 px-2">PURCHASE PRICE</TableHead>
                <TableHead className="py-0 px-2">ACTION(S)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {visibleBadges.length > 0 ? (
                visibleBadges.map((badge, index) => {
                  const isEditing = badge.id === editingBadgeId;

                  return (
                    <TableRow key={index} className="h-8">
                      <TableCell className="py-1 pl-2 pr-16 text-center">
                        {isEditing ? (
                          <SelectSlot
                            onSelectRarity={(rarity) => {
                              setEditedRarity(rarity);
                              handleSelectRarityBadgeForEdit(
                                setEditedName,
                                rarity
                              );
                            }}
                            selectedRarity={editedRarity}
                            rounded={true}
                          />
                        ) : (
                          <p
                            className="border-2 rounded-2xl p-1 text-sm"
                            style={{ borderColor: badge.rarity.color }}
                          >
                            {badge.rarity.name}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="py-0 px-2">
                        {isEditing ? <p>{editedName.name}</p> : badge.name}
                      </TableCell>
                      <TableCell className="py-0 px-2">
                        {isEditing ? (
                          <NumericInput
                            placeholder="ID"
                            value={editedIssueId}
                            onChange={setEditedIssueId}
                            className="w-1/2"
                          />
                        ) : (
                          formatId(badge.issueId)
                        )}
                      </TableCell>
                      <TableCell className="py-0 px-2">
                        {isEditing ? (
                          <NumericInput
                            placeholder="Purchase Price"
                            value={editedPurchasePrice}
                            onChange={setEditedPurchasePrice}
                            className="w-1/2"
                          />
                        ) : (
                          formatPrice(badge.purchasePrice)
                        )}
                      </TableCell>
                      <TableCell className="py-0 px-2 flex gap-2 items-center">
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
                  <TableCell colSpan={5} className="text-center py-1 px-2">
                    No badge found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow className="h-10">
                <TableCell className="py-1 px-2">
                  <SelectSlot
                    onSelectRarity={(rarity) =>
                      handleSelectRarityBadges(setSelectedBadge, rarity)
                    }
                    rounded={true}
                  />
                </TableCell>
                <TableCell className="py-1 px-2">
                  {selectedBadge ? selectedBadge.name : ""}
                </TableCell>
                <TableCell className="py-1 px-2">
                  <NumericInput
                    placeholder="ID"
                    value={issueId}
                    onChange={setIssueId}
                    className="w-1/2"
                  />
                </TableCell>
                <TableCell className="py-1 px-2">
                  <NumericInput
                    placeholder="Purchase Price"
                    value={purchasePrice}
                    onChange={setPurchasePrice}
                    className="w-1/2"
                  />
                </TableCell>
                <TableCell className="py-1 px-2 flex items-center">
                  <Button
                    variant="transparent"
                    onClick={handleSubmit}
                    className="p-0 hover:text-primary"
                  >
                    <Plus />
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <ScrollControls
            showScrollMessage={showScrollMessage}
            isAtStart={isAtStart}
            isAtEnd={isAtEnd}
            startScrollingUp={startScrollingUp}
            stopScrollingUp={stopScrollingUp}
            startScrollingDown={startScrollingDown}
            stopScrollingDown={stopScrollingDown}
          />
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground py-2">
        List of your badges
      </div>
    </div>
  );
}
