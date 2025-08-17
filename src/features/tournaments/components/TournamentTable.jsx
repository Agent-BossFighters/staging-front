import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/table";
import { Badge } from "@shared/ui/badge";
import { Button } from "@ui/button";
import {
  TYPE_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@features/tournaments/constants/uiConfigs";
import { calculatePlayerSlots } from "@features/tournaments/utils/tournamentUtils";
import { registerTournament } from "@img";
import { useTableScroll } from "@shared/hook/useTableScroll";
import ScrollControls from "@ui/scroll-controls";

const TournamentTable = ({ tournaments = [], onTournamentClick }) => {
  // Vérifier si la fonction onTournamentClick est valide
  const isClickable = typeof onTournamentClick === "function";

  const {
    tableRef,
    visibleItems: visibleTournaments,
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
    items: tournaments,
    visibleRowsCount: 8,
  });

  // Fonction pour gérer le clic sur un tournoi
  const handleTournamentClick = (tournament) => {
    if (isClickable) {
      onTournamentClick(tournament);
    }
  };

  // Fonction pour obtenir le statut du tournoi correctement
  const getTournamentStatus = (tournament) => {
    // Chercher le statut dans status ou tournament_status
    const statusCode = (
      tournament.status !== undefined
        ? tournament.status
        : tournament.tournament_status !== undefined
          ? tournament.tournament_status
          : 0
    ).toString();

    return {
      label: STATUS_LABELS[statusCode] || "DRAFT",
      colorClass: STATUS_COLORS[statusCode] || "bg-gray-500 text-white",
    };
  };

  // Fonction pour obtenir le nombre d'équipes inscrites
  const getTeamsCount = (tournament) => {
    // Si teams est un tableau, utiliser sa longueur
    if (Array.isArray(tournament.teams)) {
      return tournament.teams.length;
    }
    // Sinon utiliser teams_count s'il existe, ou 0 par défaut
    return tournament.teams_count !== undefined ? tournament.teams_count : 0;
  };

  // Fonction pour obtenir le mode du tournoi
  const getTournamentMode = (tournament) => {
    const tournamentType = tournament.tournament_type?.toString() || "0";

    // Déterminer le mode en fonction du type de tournoi
    if (tournamentType === "0" || tournamentType === "showtime_survival") {
      return "Survival";
    } else if (tournamentType === "1" || tournamentType === "showtime_score") {
      return "Score Counter";
    } else if (tournamentType === "2" || tournamentType === "arena") {
      return "Team vs Team";
    }

    // Mode par défaut si le type n'est pas reconnu
    return "Unknown";
  };

  // Si aucun tournoi n'est disponible
  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        No tournaments found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-hidden">
      <div
        className="w-full"
        ref={tableRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Table className="w-full min-w-[900px]">
          <TableHeader>
            <TableRow className="text-sm bg-gray-800 text-white border-b border-gray-700">
              <TableHead className="w-[18%] py-3">NAME</TableHead>
              <TableHead className="w-[7%] py-3">TYPE</TableHead>
              <TableHead className="w-[10%] py-3">MODE</TableHead>
              <TableHead className="w-[10%] py-3">STATUS</TableHead>
              <TableHead className="w-[8%] py-3">TEAMS</TableHead>
              <TableHead className="w-[9%] py-3">
                PLAYER(S) <br /> PER TEAM
              </TableHead>
              <TableHead className="w-[8%] py-3">
                PLAYER(S) <br /> /SLOTS
              </TableHead>
              <TableHead className="w-[7%] py-3">ROUND(S)</TableHead>
              <TableHead className="w-[10%] py-3">
                AGENT LVL <br /> REQUIRED
              </TableHead>
              <TableHead className="w-[6%] py-3">CODE</TableHead>
              <TableHead className="w-[8%] py-3">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTournaments.map((tournament, index) => {
              const status = getTournamentStatus(tournament);
              const teamsCount = getTeamsCount(tournament);
              const mode = getTournamentMode(tournament);
              const slots = calculatePlayerSlots(tournament);

              return (
                <TableRow
                  key={tournament.id}
                  className={`${index % 2 === 0 ? "bg-black" : "bg-gray-900"} ${isClickable ? "hover:bg-gray-800 cursor-pointer" : ""}`}
                  onClick={
                    isClickable
                      ? () => handleTournamentClick(tournament)
                      : undefined
                  }
                >
                  <TableCell className="font-medium py-3">
                    <span className="text-white hover:text-yellow-400">
                      {tournament.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    {TYPE_LABELS[tournament.tournament_type?.toString()] ===
                    "Arena"
                      ? "Arena"
                      : "Showtime"}
                  </TableCell>
                  <TableCell className="py-3">{mode}</TableCell>
                  <TableCell className="py-3">
                    <Badge className={`${status.colorClass} h-9`}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="py-3">{tournament.max_teams}</TableCell>
                  <TableCell className="py-3">
                    {tournament.players_per_team}
                  </TableCell>
                  <TableCell className="py-3">{slots.formatted}</TableCell>
                  <TableCell className="py-3">
                    {tournament.rounds || 1}
                  </TableCell>
                  <TableCell className="py-3">
                    {tournament.agent_level_required || 0}
                  </TableCell>
                  <TableCell className="py-3">
                    {tournament.entry_code ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="py-3">
                    <button
                      className="flex items-center justify-center w-full"
                      onClick={(e) => {
                        e.stopPropagation(); // Empêcher la propagation pour éviter le double clic
                        if (isClickable) handleTournamentClick(tournament);
                      }}
                    >
                      <img
                        src={registerTournament}
                        alt="enterTournament"
                        className="w-8 h-8 p-1"
                      />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
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
  );
};

export default TournamentTable;
