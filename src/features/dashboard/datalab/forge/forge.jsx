import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { formatNumber, formatPrice } from "@utils/formatters";
import { useForge } from "./hook/useForge";
import raritiesData from "@shared/data/rarities.json";
import { RarityCell } from "@shared/ui/rarity-cell";
import { useUserPreference } from "@context/userPreference.context";
import { getRarityOrder } from "@shared/hook/rarity";

const TYPE_OPTIONS = [
  { label: "Merge", value: "merge" },
  { label: "Craft", value: "craft" },
];

const ITEM_OPTIONS = [
  { label: "Digital", value: "digital" },
  { label: "NFT", value: "nft" },
];

export default function Forge() {
  const [type, setType] = useState("merge");
  const [item, setItem] = useState("digital");
  const { rows, perks, loading, fetchForge } = useForge();
  const { maxRarity } = useUserPreference();

  const sanitize = (v) => String(v || "").toLowerCase().replace(/[^a-z]/g, "");
  const findKnownRarity = (value) => {
    const rawSan = sanitize(value);
    const match = raritiesData.rarities.find((r) => sanitize(r.rarity) === rawSan);
    return match ? match.rarity : String(value || "");
  };

  const extractRowRarity = (row) => {
    const raw = row?.RARITY ?? row?.['1. rarity'] ?? row?.rarity ?? row?.Rarity;
    return findKnownRarity(raw);
  };

  // Trouver la ligne API correspondant à une rareté connue (quelle que soit la forme renvoyée par l'API)
  const getRowForRarity = (rowsList, targetRarity) => {
    const list = Array.isArray(rowsList) ? rowsList : [];
    const targetSan = sanitize(targetRarity);
    for (const rw of list) {
      const rowRarity = extractRowRarity(rw);
      if (sanitize(rowRarity) === targetSan) return rw;
    }
    return undefined;
  };

  useEffect(() => {
    fetchForge(type, item);
  }, [type, item, fetchForge]);

  // Rafraîchir après sauvegarde dans l'Admin Panel
  useEffect(() => {
    const handleForgeUpdated = () => fetchForge(type, item);
    const handlePerksUpdated = () => fetchForge(type, item);
    if (typeof window !== 'undefined') {
      window.addEventListener('forge-settings-updated', handleForgeUpdated, { passive: true });
      window.addEventListener('perks-lock-updated', handlePerksUpdated, { passive: true });
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('forge-settings-updated', handleForgeUpdated, { passive: true });
        window.removeEventListener('perks-lock-updated', handlePerksUpdated, { passive: true });
      }
    };
  }, [type, item, fetchForge]);

  // Préremplir automatiquement ITEM = NFT quand TYPE = Craft
  useEffect(() => {
    if (type === "craft") {
      setItem("nft");
    }
  }, [type]);

  const columns = useMemo(() => {
    if (type === "merge" && item === "digital") {
      return ["RARITY", "NB PREVIOUS\nRARITY ITEM", "CASH"];
    }
    if (type === "merge" && item === "nft") {
      return [
        "RARITY",
        "SUPPLY",
        "NB PREVIOUS RARITY ITEM",
        "CASH",
        "FUSION CORE",
        "$BFT",
        "$BFT COST",
        "SP. MARKS REWARD",
        "SP. MARKS VALUE",
      ];
    }
    // craft - nft
    return [
      "RARITY",
      "SUPPLY",
      "NB DIGITAL",
      "$BFT",
      "$BFT COST",
      "SP. MARKS REWARD",
      "SP. MARKS VALUE",
    ];
  }, [type, item]);

  const renderCell = (row, key) => {
    if (!row) return "N/A";
    
    // Mapper les clés d'affichage vers les vraies clés de l'API
    const apiKey = key === "NB PREVIOUS\nRARITY ITEM" ? "NB PREVIOUS RARITY ITEM" : key;
    
    const value = row[apiKey];
    if (value === null || value === undefined || value === '') return 'N/A';
    if (apiKey === "$BFT COST" || apiKey === "SP. MARKS VALUE") return formatPrice(value);
    if (apiKey === "RARITY") {
      const normalized = findKnownRarity(value);
      const r = raritiesData.rarities.find((x) => x.rarity === normalized);
      return <RarityCell rarity={normalized} color={r?.color || "#888"} />;
    }
    if (typeof value === "number") return formatNumber(value);
    return value ?? "N/A";
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold py-2">FORGE</h2>

      <div className="flex gap-8 mb-4 items-end">
        <div className="min-w-[100px]">
          <h3 className="text-1rem font-bold whitespace-nowrap mb-1">TYPE</h3>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[100px]">
          <h3 className="text-1rem font-bold whitespace-nowrap mb-1">ITEM</h3>
          <Select value={item} onValueChange={setItem}>
            <SelectTrigger>
              <SelectValue placeholder="Item" />
            </SelectTrigger>
            <SelectContent>
              {(type === 'craft' ? ITEM_OPTIONS.filter(o => o.value === 'nft') : ITEM_OPTIONS).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`overflow-x-auto mr-auto ${type === "merge" && item === "digital" ? "sm:w-[80vw] xl:w-[40vw]" : "w-[80vw]"}`}>
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            {columns.map((c, idx) => (
              <TableHead key={c} className={idx === 0 ? "p-2 text-left" : "p-2 text-left whitespace-pre-line"}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>Loading...</TableCell>
            </TableRow>
          ) : (
            // Filtrer et afficher les lignes renvoyées par l'API, en respectant la max rarity et le plafond Mythic pour Craft-NFT
            (() => {
              const normalizeName = (r) => (r ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase() : 'Unique');
              const userMaxOrder = getRarityOrder(normalizeName(maxRarity));
              const mythicOrder = getRarityOrder('Mythic');
              const effectiveMaxOrder = (type === 'craft' && item === 'nft')
                ? Math.min(userMaxOrder, mythicOrder)
                : userMaxOrder;
              const displayRarities = raritiesData.rarities.filter((r) => getRarityOrder(r.rarity) <= effectiveMaxOrder);
              return displayRarities.map((r) => {
                const rowData = getRowForRarity(rows, r.rarity);
                return (
                  <TableRow key={r.rarity}>
                    {columns.map((c, idx) => {
                      if (c === 'RARITY') {
                        return <RarityCell key={c} rarity={r.rarity} color={r.color} />;
                      }
                      return (
                        <TableCell key={c} className={idx === 0 ? "p-2 text-left" : "p-2 text-left"}>{renderCell(rowData, c)}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              });
            })()
          )}
        </TableBody>
      </Table>
      </div>
      
      {/* Texte explicatif pour le tableau Forge */}
      <div className={`${type === "merge" && item === "digital" ? "sm:w-[80vw] xl:w-[40vw] mr-auto" : "w-full max-w-[800px] mx-auto"}`}>
        <p className="mt-4 text-base text-muted-foreground text-center">
          {type === "merge" && item === "digital" && "Merge cost from digital assets"}
          {type === "merge" && item === "nft" && "Merge cost and reward from previous NFT rarity"}
          {type === "craft" && item === "nft" && "Craft cost and reward from digital asset"}
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Perks lock</h3>
        <div className="w-full overflow-x-auto">
          <Table className="w-full text-sm border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-[#1E272E] z-10">RARITY</TableHead>
                {raritiesData.rarities
                  .filter((r) => {
                    const maxOrder = getRarityOrder(
                      (maxRarity || "legendary").charAt(0).toUpperCase() + (maxRarity || "legendary").slice(1).toLowerCase()
                    );
                    return getRarityOrder(r.rarity) <= maxOrder;
                  })
                  .map((r) => (
                    <TableHead key={r.rarity} className="text-center">
                      <p
                        className="border-2 rounded-2xl px-3 py-1 text-sm w-[110px]"
                        style={{ borderColor: r.color }}
                      >
                        {r.rarity}
                      </p>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { label: "NO STAR", key: "NO STAR" },
                { label: "★", key: "1 STAR" },
                { label: "★★", key: "2 STARS" },
                { label: "★★★", key: "3 STARS" },
              ].map((rowDef) => (
                <TableRow key={`perks-row-${rowDef.key}`}>
                  <TableHead className="sticky left-0 bg-black w-[120px] text-left z-10">
                    {rowDef.label}
                  </TableHead>
                  {raritiesData.rarities
                    .filter((r) => {
                      const maxOrder = getRarityOrder(
                        (maxRarity || "legendary").charAt(0).toUpperCase() + (maxRarity || "legendary").slice(1).toLowerCase()
                      );
                      return getRarityOrder(r.rarity) <= maxOrder;
                    })
                    .map((r) => {
                      const found = perks.find((p) => p.RARITY === r.rarity) || {};
                      return (
                        <TableCell
                          key={`perks-${rowDef.key}-${r.rarity}`}
                          className="text-center"
                        >
                          {formatNumber(found[rowDef.key] ?? 0)}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Texte explicatif pour le tableau Perks lock */}
        <p className="mt-4 text-base text-muted-foreground text-center max-w-[800px] mx-auto">
          Power and Value Perks lock cost to craft per star(s) and rarity (Reinforcers/Variators)
        </p>
      </div>
    </div>
  );
}


