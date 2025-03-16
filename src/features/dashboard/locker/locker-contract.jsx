import { useEffect, useState } from "react";
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
import { Contract } from "@img/index";
import {
  handleSelectRarityContract,
  handleSelectRarityContractForEdit,
  getRarityOrder,
} from "@shared/hook/rarity";
import { useContracts } from "@features/dashboard/locker/hook/useContracts";
import { useEditContract } from "@features/dashboard/locker/hook/useEditContract";
import { useUserPreference } from "@context/userPreference.context";
import ShowrunnerContractSkeleton from "./skeletons/ShowrunnerContractSkeleton";
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

  useEffect(() => {
    fetchMyContracts();
  }, []);

  const filteredContracts = contracts.filter(
    (contract) =>
      getRarityOrder(contract.rarity.name) <= getRarityOrder(maxRarity)
  );

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
    <div>
      <h2 className="text-2xl font-extrabold py-2 flex gap-3 items-center">
        <img src={Contract} alt="contract" className="w-10 h-10" />
        SHOWRUNNER CONTRACT(S)
      </h2>
      <Table className="">
        <TableCaption>
          List of your showrunner contracts
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
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract, index) => {
              const isEditing = contract.id === editingContractId;

              return (
                <TableRow key={index}>
                  <TableCell>
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
                        className="border-2 rounded-full text-center"
                        style={{ borderColor: contract.rarity.color }}
                      >
                        {contract.rarity.name}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? <p>{editedName.name}</p> : contract.name}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <NumericInput
                        placeholder="Issue ID"
                        value={editedIssueId}
                        onChange={setEditedIssueId}
                        className="w-1/2"
                      />
                    ) : (
                      contract.issueId
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
                      contract.purchasePrice
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
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
              <TableCell colSpan={5} className="text-center">
                No contract found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell>
              <SelectSlot
                onSelectRarity={(rarity) =>
                  handleSelectRarityContract(setSelectedContract, rarity)
                }
                rounded={true}
              />
            </TableCell>
            <TableCell>
              {selectedContract ? selectedContract.name : ""}
            </TableCell>
            <TableCell>
              <NumericInput
                placeholder="Issue ID"
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
