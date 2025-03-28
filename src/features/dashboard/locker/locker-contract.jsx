import { useEffect, useState, useRef } from "react";
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
import { NumericInput } from "@ui/numeric-input";
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import ActionsTable from "@features/dashboard/locker/actions-table";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { postData, deleteData } from "@utils/api/data";
import {
  handleSelectRarityContract,
  handleSelectRarityContractForEdit,
  getRarityOrder,
} from "@shared/hook/rarity";
import { useContracts } from "@features/dashboard/locker/hook/useContracts";
import { useEditContract } from "@features/dashboard/locker/hook/useEditContract";
import { useUserPreference } from "@context/userPreference.context";
import ShowrunnerContractSkeleton from "./skeletons/ShowrunnerContractSkeleton";
import { formatPrice, formatNumber } from "@utils/formatters";
export default function LockerContract() {
  const { contracts, setContracts, loading, setLoading, fetchMyContracts } =
    useContracts();
  const {
    editingContractId,
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
  } = useEditContract(setContracts);
  const [selectedContract, setSelectedContract] = useState(null);
  const [issueId, setIssueId] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const { maxRarity } = useUserPreference();
  const [startIndex, setStartIndex] = useState(0);
  const [isMouseOverTable, setIsMouseOverTable] = useState(false);
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const tableRef = useRef(null);
  
  // Nombre de lignes à afficher
  const visibleRowsCount = 8;

  useEffect(() => {
    fetchMyContracts();
  }, []);

  const filteredContracts = contracts.filter(
    (contract) =>
      getRarityOrder(contract.rarity.name) <= getRarityOrder(maxRarity)
  );

  useEffect(() => {
    setShowScrollMessage(filteredContracts.length > visibleRowsCount);
  }, [filteredContracts.length]);

  useEffect(() => {
    const wheelHandler = (e) => {
      if (!isMouseOverTable) return;
      
      // Si la souris est sur le tableau, empêcher le défilement de la page
      e.preventDefault();
      
      if (filteredContracts.length <= visibleRowsCount) return;
      
      if (e.deltaY > 0) {
        // Défilement vers le bas
        setStartIndex(prev => Math.min(prev + 1, filteredContracts.length - visibleRowsCount));
      } else if (e.deltaY < 0) {
        // Défilement vers le haut
        setStartIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', wheelHandler);
    };
  }, [isMouseOverTable, filteredContracts.length, visibleRowsCount]);
  
  const handleMouseEnter = () => {
    setIsMouseOverTable(true);
  };
  
  const handleMouseLeave = () => {
    setIsMouseOverTable(false);
  };

  // Sélectionner les lignes visibles en fonction de l'indice de départ
  const visibleContracts = filteredContracts.slice(startIndex, startIndex + visibleRowsCount);

  const handleSubmit = async () => {
    const missingFields = [];
    if (!selectedContract) missingFields.push("Rarity");
    if (!issueId) missingFields.push("ID");
    if (!purchasePrice) missingFields.push("Purchase Price");
    if (missingFields.length > 0) {
      toast.error(
        `Missing fields: ${missingFields.join(", ")}. Please fill all fields.`
      );
    }
    const payload = {
      nft: {
        itemId: selectedContract.id,
        issueId: issueId.trim(),
        purchasePrice: purchasePrice.trim(),
      },
    };
    setLoading(true);
    toast
      .promise(postData("v1/nfts/create", payload), {
        loading: "Creating NFT...",
        success: (res) => {
          setContracts((prevContracts) => [...prevContracts, res.nft]);
          setIssueId("");
          setPurchasePrice("");
          setSelectedContract(null);
          return "NFT create successfully";
        },
        error: (err) => {
          return `Error: ${err.message}`;
        },
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (contractId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this contract?"
    );
    if (!confirm) return;
    toast.promise(deleteData(`v1/nfts/${contractId}`), {
      loading: "Deleting NFT...",
      success: () => {
        setContracts((prevContracts) =>
          prevContracts.filter((contractData) => contractData.id !== contractId)
        );
        return "Showrunner contract deleted successfully";
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  if (loading) {
    return <ShowrunnerContractSkeleton />;
  }

  return (
    <div className="flex flex-col w-[60%] px-5 gap-5">
      <div className="pt-2">
      <div 
        ref={tableRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
      <Table className="">
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
          {visibleContracts.length > 0 ? (
            visibleContracts.map((contract, index) => {
              const isEditing = contract.id === editingContractId;

              return (
                <TableRow key={index} className="h-8">
                  <TableCell className="py-1 pl-2 pr-16 text-center">
                    {isEditing ? (
                      <SelectSlot
                        onSelectRarity={(rarity) => {
                          setEditedRarity(rarity);
                          handleSelectRarityContractForEdit(
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
                        style={{ borderColor: contract.rarity.color }}
                      >
                        {contract.rarity.name}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="py-0 px-2">
                    {isEditing ? <p>{editedName.name}</p> : contract.name}
                  </TableCell>
                  <TableCell className="py-0 px-2">
                    {isEditing ? (
                      <NumericInput
                        placeholder="Issue ID"
                        value={editedIssueId}
                        onChange={setEditedIssueId}
                        className="w-1/2"
                      />
                    ) : (
                      formatNumber(contract.issueId)
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
                      formatPrice(contract.purchasePrice)
                    )}
                  </TableCell>
                  <TableCell className="py-0 px-2 flex gap-2 items-center">
                    <ActionsTable
                      data={contract}
                      onEdit={handleEdit}
                      onDelete={() => handleDelete(contract.id)}
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
                No contract found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow className="h-10">
            <TableCell className="py-1 px-2">
              <SelectSlot
                onSelectRarity={(rarity) =>
                  handleSelectRarityContract(setSelectedContract, rarity)
                }
                rounded={true}
              />
            </TableCell>
            <TableCell className="py-1 px-2">
              {selectedContract ? selectedContract.name : ""}
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
                className="p-0 hover:text-primary hover:scale-150"
              >
                <Plus />
              </Button>
            </TableCell>
          </TableRow>
          </TableFooter>
        </Table>
        {showScrollMessage && (
          <div className="text-primary text-center text-3xl py-1">
            ⩔⩔ <span className="text-xl">Scroll down for more</span> ⩔⩔
          </div>
        )}
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground py-2">
          List of your showrunner contracts
      </div>
    </div>
  );
}
