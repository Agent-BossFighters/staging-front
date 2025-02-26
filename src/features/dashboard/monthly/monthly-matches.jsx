import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";

export default function MonthlyMatches({
  dailyMetrics,
  monthlyTotals,
  loading,
}) {
  const calculateEnergyCost = (energy) => {
    return (energy * 1.49).toFixed(2);
  };

  const calculateBftValue = (bft) => {
    return (bft * 0.1).toFixed(2);
  };

  const calculateFlexValue = (flex) => {
    return (flex * 0.00744).toFixed(2);
  };

  const calculateProfit = (bftValue, flexValue, energyCost) => {
    return (
      parseFloat(bftValue) +
      parseFloat(flexValue) -
      parseFloat(energyCost)
    ).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 min-h-[200px] bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-4 w-48 bg-muted-foreground/30 rounded"></div>
          <div className="h-4 w-36 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-5">
      <div className="overflow-y-auto max-h-[600px] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-left">DATE</TableHead>
              <TableHead className="text-center">
                MATCHES
                <br /> PLAYED
              </TableHead>
              <TableHead className="text-center">
                IG TIME
                <br /> (Min)
              </TableHead>
              <TableHead className="text-center">
                ENERGY
                <br /> USED
              </TableHead>
              <TableHead className="text-center text-destructive">
                ENERGY
                <br /> COST
              </TableHead>
              <TableHead className="text-center">
                TOTAL
                <br /> $BFT
              </TableHead>
              <TableHead className="text-center text-accent">BFT ($)</TableHead>
              <TableHead className="text-center">FLEX</TableHead>
              <TableHead className="text-center text-accent">
                FLEX ($)
              </TableHead>
              <TableHead className="text-center text-green-500">
                PROFIT
              </TableHead>
              <TableHead className="text-center">WIN RATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(dailyMetrics || {}).map(([date, metrics]) => {
              const energyCost = calculateEnergyCost(metrics.total_energy);
              const bftValue = calculateBftValue(metrics.total_bft);
              const flexValue = calculateFlexValue(metrics.total_flex);
              const profit = calculateProfit(bftValue, flexValue, energyCost);

              return (
                <TableRow key={date} className="border-b border-border">
                  <TableCell>{new Date(date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    {metrics.total_matches}
                  </TableCell>
                  <TableCell className="text-center">
                    {metrics.total_matches * 60}
                  </TableCell>
                  <TableCell className="text-center">
                    {metrics.total_energy}
                  </TableCell>
                  <TableCell className="text-center text-destructive">
                    ${energyCost}
                  </TableCell>
                  <TableCell className="text-center">
                    {metrics.total_bft}
                  </TableCell>
                  <TableCell className="text-center text-accent">
                    ${bftValue}
                  </TableCell>
                  <TableCell className="text-center">
                    {metrics.total_flex}
                  </TableCell>
                  <TableCell className="text-center text-accent">
                    ${flexValue}
                  </TableCell>
                  <TableCell className="text-center text-green-500">
                    ${profit}
                  </TableCell>
                  <TableCell className="text-center">
                    {metrics.win_rate}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
