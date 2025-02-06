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
import { getData, postData, putData, deleteData } from "@utils/api/data";
import { Contract } from "@img/index";
import { handleSelectRarity } from "@/shared/hook/rarity";

export default function LockerContract() {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [issueId, setIssueId] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const [editingContractId, setEditingContractId] = useState(null);
  const [editedRarity, setEditedRarity] = useState("");
  const [editedIssueId, setEditedIssueId] = useState("");
  const [editedPurchasePrice, setEditedPurchasePrice] = useState("");

  useEffect(() => {
    async function fetchMyContracts() {
      const data = await getData("/v1/showrunner_contracts/owned");
      setLoading(true);
      setContracts(data ? data : []);
      setLoading(false);
    }
    fetchMyContracts();
  }, []);

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
      setContracts((prevContracts) => [
        ...prevContracts,
        { nft_contract: response.nft },
      ]);
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
        prevContracts.filter(
          (contractData) => contractData.nft_contract.id !== contractId,
        ),
      );
    }
  };

  const handleEdit = (contract) => {
    setEditingContractId(contract.id);
    setEditedRarity(contract.rarity.name);
    setEditedIssueId(contract.issueId);
    setEditedPurchasePrice(contract.purchasePrice);
  };

  const handleSave = async () => {
    const updatedContract = {
      issueId: editedIssueId,
      purchasePrice: editedPurchasePrice,
    };

    const response = await putData(
      `/v1/nfts/${editingContractId}`,
      updatedContract,
    );

    if (response.success) {
      setContracts((prevContracts) =>
        prevContracts.map((contractData) =>
          contractData.nft_contract.id === editingContractId
            ? { ...contractData, nft_contract: updatedContract }
            : contractData,
        ),
      );
      setEditingContractId(null); // Sortir du mode édition
    } else {
      console.error("Failed to update contract");
    }
  };
  const handleCancel = () => {
    setEditingContractId(null);
    setEditedRarity("");
    setEditedIssueId("");
    setEditedPurchasePrice("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold py-2 flex gap-3 items-center">
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
          {contracts.length > 0 ? (
            contracts.map((contractData, index) => {
              console.log(contractData);
              console.log("editedRarity", editedRarity);
              const contract = contractData.nft_contract;
              const isEditing = contract.id === editingContractId;

              return (
                <TableRow key={index}>
                  <TableCell style={{ color: contract.rarity.color }}>
                    {isEditing ? (
                      <SelectSlot
                        onSelectRarity={(rarity) => setEditedRarity(rarity)}
                        selectedRarity={editedRarity}
                        limitRarity="Mythic"
                        rounded={true}
                      />
                    ) : (
                      contract.rarity.name
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? <p>{contract.name}</p> : contract.name}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedIssueId}
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
                        onChange={(e) => setEditedPurchasePrice(e.target.value)}
                      />
                    ) : (
                      contract.purchasePrice
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <ActionsTable
                      contract={contract}
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
              <TableCell colSpan={4}>No contract found</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell>
              <SelectSlot
                onSelectRarity={(rarity) =>
                  handleSelectRarity(setSelectedContract, rarity)
                }
                limitRarity="Mythic"
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
