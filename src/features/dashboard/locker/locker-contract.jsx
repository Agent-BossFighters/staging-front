import { useEffect, useState } from "react";
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
import { Input } from "@ui/input";
import SelectSlot from "@features/dashboard/datalab/slot/select-slot";
import ActionsTable from "./actions-table";
import { Button } from "@ui/button";
import { Plus } from "lucide-react";
import { postData, deleteData } from "@utils/api/data";
import { Contract } from "@img/index";
import {
  handleSelectRarityContract,
  handleSelectRarityContractForEdit,
  getRarityOrder,
} from "@shared/hook/rarity";
import { useContracts } from "./hook/useContracts";
import { useEditContract } from "./hook/useEditContract";
import { useUserPreference } from "@context/userPreference.context";

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
      getRarityOrder(contract.rarity.name) <= getRarityOrder(maxRarity),
  );

  const handleSubmit = async () => {
    if (!selectedContract || !issueId || !purchasePrice) {
      console.error("fill all fields");
      return;
    }
    const payload = {
      nft: {
        itemId: selectedContract.id,
        issueId: issueId.trim(),
        purchasePrice: purchasePrice.trim(),
      },
    };
    setLoading(true);
    const response = await postData("/v1/nfts/create", payload);
    if (response && response.nft) {
      setContracts((prevContracts) => [...prevContracts, response.nft]);
      setIssueId("");
      setPurchasePrice("");
      setSelectedContract(null);
    }
    setLoading(false);
  };

  const handleDelete = async (contractId) => {
    const response = await deleteData(`/v1/nfts/${contractId}`);
    if (response) {
      setContracts((prevContracts) =>
        prevContracts.filter((contractData) => contractData.id !== contractId),
      );
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold py-2 flex gap-3 items-center">
        <img src={Contract} alt="contract" className="w-10 h-10" />
        SHOWRUNNER CONTRACT(S)
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
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract, index) => {
              const isEditing = contract.id === editingContractId;

              return (
                <TableRow key={index}>
                  <TableCell style={{ color: contract.rarity.color }}>
                    {isEditing ? (
                      <SelectSlot
                        onSelectRarity={(rarity) => {
                          setEditedRarity(rarity);
                          handleSelectRarityContractForEdit(
                            setEditedName,
                            rarity,
                          );
                        }}
                        selectedRarity={editedRarity}
                        rounded={true}
                      />
                    ) : (
                      contract.rarity.name
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? <p>{editedName.name}</p> : contract.name}
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
                      contract.issueId
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
