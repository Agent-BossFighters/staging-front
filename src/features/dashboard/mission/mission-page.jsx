import React from "react";
import { backgroundMission } from "@img/index";
import QuestSection from "./components/QuestSection";
import { useAuth } from "@context/auth.context";
import { Navigate } from "react-router-dom";

// Composant protégé qui vérifie si l'utilisateur est premium
const MissionPageContent = () => {
  return (
    <div className="w-5/6 mx-auto pt-2 flex flex-col h-full relative">
      {/* Container principal avec fond sombre - hauteur réduite pour mieux adapter l'image */}
      <div className="flex-1 rounded-lg border border-border p-6 relative overflow-hidden">
        <h1 className="text-5xl font-extrabold pb-2 text-primary">MISSIONS</h1>
        <p className="text-primary flex justify-center mt-2 mb-6">
          Increase your level to 10 each month and take part in the Boss Fighters NFT raffle !
        </p>
        
        {/* Intégration du composant QuestSection sur toute la largeur */}
        <div className="mt-8">
          <QuestSection />
        </div>
        
        {/* Background */}
        <div 
          className="absolute inset-0 -z-10 rounded-lg opacity-80"
          style={{
            backgroundImage: `url(${backgroundMission})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%"
          }}
        />
      </div>
    </div>
  );
};

// Composant principal qui vérifie si l'utilisateur est premium
export default function MissionPage() {
  const { user } = useAuth();
  const isPremium = user?.isPremium === true;

  if (!isPremium) {
    return <Navigate to="/dashboard" replace />;
  }

  return <MissionPageContent />;
}
