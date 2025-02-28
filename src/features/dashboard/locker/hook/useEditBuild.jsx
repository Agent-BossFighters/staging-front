import { useState } from "react";
import toast from "react-hot-toast";
import { putData } from "@utils/api/data";

export const useEditBuild = (setBuilds) => {
  const [editingBuildId, setEditingBuildId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedBonus, setEditedBonus] = useState("");

  const handleEdit = (build) => {
    setEditingBuildId(build.id);
    setEditedName(build.buildName);
    setEditedBonus(build.bftBonus);
  };

  const handleSave = async () => {
    const updatedBuild = {
      user_build: {
        buildName: editedName,
        bftBonus: editedBonus,
      },
    };

    toast.promise(putData(`v1/user_builds/${editingBuildId}`, updatedBuild), {
      loading: "Updating build...",
      success: (response) => {
        setBuilds((prevBuilds) =>
          prevBuilds.map((buildData) =>
            buildData.id === response.build.id ? response.build : buildData
          )
        );
        setEditingBuildId(null);
        return "Build updated successfully";
      },
      error: (err) => {
        console.error("Error updating build:", err);
        return `Error: ${err.message}`;
      },
    });
  };

  const handleCancel = () => {
    setEditingBuildId(null);
    setEditedName("");
    setEditedBonus("");
  };

  return {
    editingBuildId,
    editedName,
    editedBonus,
    setEditedName,
    setEditedBonus,
    handleEdit,
    handleSave,
    handleCancel,
  };
};
