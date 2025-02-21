import { useState } from "react";
import toast from "react-hot-toast";
import { putData } from "@utils/api/data";

export const useEditBuild = (setBuilds) => {
  const [editingBuildId, setEditingBuildId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedBonus, setEditedBonus] = useState("");
  const [editedPerks, setEditedPerks] = useState("");

  const handleEdit = (build) => {
    setEditingBuildId(build.id);
    setEditedName(build.buildName);
    setEditedBonus(build.bonusMultiplier);
    setEditedPerks(build.perksMultiplier);
  };

  const handleSave = async () => {
    const updatedBuild = {
      buildName: editedName,
      bonusMultiplier: editedBonus,
      perksMultiplier: editedPerks,
    };

    toast.promise(putData(`v1/user_builds/${editingBuildId}`, updatedBuild), {
      loading: "Updating build...",
      success: (prevBuild) => {
        setBuilds((prevBuilds) =>
          prevBuilds.map((buildData) =>
            buildData.id === prevBuild.id ? prevBuild : buildData,
          ),
        );
        setEditingBuildId(null);
        return "Build updated successfully";
      },
      error: (err) => {
        return `Error: ${err.message}`;
      },
    });
  };

  const handleCancel = () => {
    setEditingBuildId(null);
    setEditedName("");
    setEditedBonus("");
    setEditedPerks("");
  };

  return {
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
  };
};
