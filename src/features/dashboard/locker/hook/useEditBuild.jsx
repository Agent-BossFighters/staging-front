import { useState } from "react";
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

    try {
      const response = await putData(
        `/v1/user_builds/${editingBuildId}`,
        updatedBuild,
      );

      if (response.build) {
        setBuilds((prevBuilds) =>
          prevBuilds.map((buildData) =>
            buildData.id === response.build.id ? response.build : buildData,
          ),
        );
        setEditingBuildId(null);
      }
    } catch (error) {
      console.error("Failed to update build:", error);
    }
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
