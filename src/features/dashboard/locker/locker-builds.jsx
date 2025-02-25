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
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { NumericInput } from "@ui/numeric-input";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import ActionsTable from "./actions-table";
import { postData, deleteData } from "@utils/api/data";
import { useBuilds } from "./hook/useBuilds";
import { useEditBuild } from "./hook/useEditBuild";
import { GreenFighter } from "@img/index";

export default function Lockerbuilds() {
  const { builds, setBuilds, loading, setLoading, fetchMyBuilds } = useBuilds();
  const {
    editingBuildId,
    editedName,
    editedBonus,
    editedPerks,
    setEditedName,
    setEditedBonus,
    setEditedPerks,
    handleEdit,
    handleSave,
    handleCancel,
  } = useEditBuild(setBuilds);
  const [buildName, setBuildName] = useState("");
  const [bonus, setBonus] = useState("");
  const [perks, setPerks] = useState("");

  useEffect(() => {
    fetchMyBuilds();
  }, []);

  const handleSubmit = async () => {
    const missingFields = [];
    if (!buildName) missingFields.push("Build Name");
    if (!bonus) missingFields.push("Bonus Multiplier");
    if (!perks) missingFields.push("Perks Multiplier");
    if (missingFields.length > 0) {
      toast.error(
        `Missing fields: ${missingFields.join(", ")}. Please fill all fields.`
      );
    }
    const payload = {
      user_build: {
        buildName: buildName,
        bonusMultiplier: bonus,
        perksMultiplier: perks,
      },
    };
    setLoading(true);
    toast.promise(postData("v1/user_builds/create", payload), {
      loading: "Creating Build...",
      success: (res) => {
        setBuilds((prevBuilds) => [...prevBuilds, res.build]);
        setBuildName("");
        setBonus("");
        setPerks("");
        return "Build created successfully";
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  const handleDelete = async (buildId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this badge?"
    );
    if (!confirm) return;
    toast.promise(deleteData(`v1/user_builds/${buildId}`), {
      loading: "Deleting NFT...",
      success: () => {
        setBuilds((prevBuilds) =>
          prevBuilds.filter((buildData) => buildData.id !== buildId)
        );
        return "Showrunner contract deleted successfully";
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-[400px]">
      <h2 className="text-3xl font-extrabold py-2 flex gap-3 items-center">
        <img src={GreenFighter} alt="Build" className="w-10 h-10" />
        BUILD(S)
      </h2>
      <div className="flex-grow overflow-auto">
        <Table className="">
          <TableCaption>Desc ?</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>BUILD NAME</TableHead>
              <TableHead>BONUS MULTIPLIER</TableHead>
              <TableHead>PERKS MULTIPLIER</TableHead>
              <TableHead>ACTION(S)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {builds.length > 0 ? (
              builds.map((build, index) => {
                const isEditing = build.id === editingBuildId;

                return (
                  <TableRow key={index} className="">
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        build.buildName
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <NumericInput
                          placeholder="Bonus Multiplier"
                          value={editedBonus}
                          onChange={setEditedBonus}
                          className="w-1/2"
                        />
                      ) : (
                        build.bonusMultiplier
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <NumericInput
                          placeholder="Perks Multiplier"
                          value={editedPerks}
                          onChange={setEditedPerks}
                          className="w-1/2"
                        />
                      ) : (
                        build.perksMultiplier
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2 items-center">
                      <ActionsTable
                        data={build}
                        onEdit={handleEdit}
                        onDelete={() => handleDelete(build.id)}
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
                  No Builds found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="bg-transparent">
            <TableRow>
              <TableCell>
                <Input
                  type="text"
                  placeholder="Build Name"
                  inputMode="numeric"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <NumericInput
                  placeholder="Bonus Multiplier"
                  value={bonus}
                  onChange={setBonus}
                  className="w-1/2"
                />
              </TableCell>
              <TableCell>
                <NumericInput
                  placeholder="Perks Multiplier"
                  value={perks}
                  onChange={setPerks}
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
    </div>
  );
}
