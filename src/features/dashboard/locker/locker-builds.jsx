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
import BuildSkeleton from "./skeletons/BuildSkeleton";
import { formatPercent } from "@utils/formatters";
import { useTableScroll } from "@shared/hook/useTableScroll";
import ScrollControls from "@ui/scroll-controls";

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

  const {
    tableRef,
    visibleItems: visibleBuilds,
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
    items: builds,
    visibleRowsCount: 8,
  });

  const handleSubmit = async () => {
    const missingFields = [];
    if (!buildName) missingFields.push("Build Name");
    if (!bonus) missingFields.push("$BFT Bonus");
    if (missingFields.length > 0) {
      toast.error(
        `Missing fields: ${missingFields.join(", ")}. Please fill all fields.`
      );
      return;
    }

    const payload = {
      user_build: {
        buildName: buildName,
        bftBonus: bonus,
      },
    };

    toast.promise(postData("v1/user_builds/create", payload), {
      loading: "Creating build...",
      success: (response) => {
        if (response?.build) {
          setBuilds((prevBuilds) => [...prevBuilds, response.build]);
          setBuildName("");
          setBonus("");
          return "Build created successfully";
        }
        throw new Error("Invalid response format");
      },
      error: (err) => {
        console.error("Error creating build:", err);
        return `Error: ${err.message}`;
      },
    });
  };

  const handleDelete = async (buildId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this build?"
    );
    if (!confirm) return;

    toast.promise(deleteData(`v1/user_builds/${buildId}`), {
      loading: "Deleting build...",
      success: () => {
        setBuilds((prevBuilds) =>
          prevBuilds.filter((build) => build.id !== buildId)
        );
        return "Build deleted successfully";
      },
      error: (err) => {
        console.error("Error deleting build:", err);
        return `Error: ${err.message}`;
      },
    });
  };

  if (loading) {
    return <BuildSkeleton />;
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
                <TableHead className="py-0 px-2">BUILD NAME</TableHead>
                <TableHead className="py-0 px-2">$BFT BONUS</TableHead>
                <TableHead className="py-0 px-2">ACTION(S)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {visibleBuilds.length > 0 ? (
                visibleBuilds.map((build, index) => {
                  const isEditing = build.id === editingBuildId;

                  return (
                    <TableRow key={index} className="h-8">
                      <TableCell className="py-0 px-2">
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
                      <TableCell className="py-0 px-2">
                        {isEditing ? (
                          <NumericInput
                            placeholder="$BFT Bonus"
                            value={editedBonus}
                            onChange={setEditedBonus}
                            className="w-1/2"
                            min={0}
                            max={600}
                            step={0.1}
                          />
                        ) : (
                          <div className="flex flex-col">
                            <span>{formatPercent(build.bftBonus, 2)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-0 px-2 flex gap-2 items-center">
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
                  <TableCell colSpan={3} className="text-center py-1 px-2">
                    No Builds found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow className="h-10">
                <TableCell className="py-1 px-2">
                  <Input
                    type="text"
                    placeholder="Build Name"
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                  />
                </TableCell>
                <TableCell className="py-1 px-2">
                  <NumericInput
                    placeholder="$BFT Bonus"
                    value={bonus}
                    onChange={setBonus}
                    className="w-1/2"
                    min={0}
                    max={600}
                    step={0.1}
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
        List of your builds with their BFT bonus multipliers
      </div>
    </div>
  );
}
