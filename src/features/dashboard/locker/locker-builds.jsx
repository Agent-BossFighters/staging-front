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
import { Plus } from "lucide-react";
import ActionsTable from "./actions-table";
import { postData, deleteData } from "@utils/api/data";
import { useBuilds } from "./hook/useBuilds";
import { useEditBuild } from "./hook/useEditBuild";

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
    if (!buildName || !bonus || !perks) {
      console.error("fill all fields");
      return;
    }
    const payload = {
      user_build: {
        buildName: buildName,
        bonusMultiplier: bonus,
        perksMultiplier: perks,
      },
    };
    setLoading(true);
    const response = await postData("/v1/user_builds/create", payload);
    if (response && response.build) {
      setBuilds((prevBuilds) => [...prevBuilds, response.build]);
      setBuildName("");
      setBonus("");
      setPerks("");
    }
    setLoading(false);
  };

  const handleDelete = async (buildId) => {
    const response = await deleteData(`/v1/user_builds/${buildId}`);
    if (response) {
      setBuilds((prevBuild) =>
        prevBuild.filter((buildData) => buildData.id !== buildId),
      );
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="lg:h-1/2">
      <h2 className="text-3xl font-extrabold py-2">{/* Icon */}BUILD(S)</h2>
      <Table className="">
        <TableCaption>Desc ?</TableCaption>
        <TableHeader>
          <TableRow className="bg-muted-foreground/30">
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
                      <Input
                        type="number"
                        value={editedBonus}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );
                        }}
                        className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setEditedBonus(e.target.value)}
                      />
                    ) : (
                      build.bonusMultiplier
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedPerks}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            "",
                          );
                        }}
                        className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onChange={(e) => setEditedPerks(e.target.value)}
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
              <Input
                type="number"
                placeholder="Bonus Multiplier"
                inputMode="numeric"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                className="w-1/2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                placeholder="Perks Multiplier"
                inputMode="numeric"
                value={perks}
                onChange={(e) => setPerks(e.target.value)}
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
