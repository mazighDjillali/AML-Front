import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScenarioStore } from "@/stores/scenario-store";
import { AnomalyTable } from "@/components/scenarioComp/res comp/anomaly-table";
import { FlaggedTransactionsTable } from "@/components/scenarioComp/res comp/goe-transaction-table";
// import { NodeGraph } from "@/components/graph-node";
import FlowCanvas from "@/components/flow/FlowCanvas";
import { Blacklist } from "@/components/scenarioComp/res comp/blacklist-res";
import { ErrorBoundary } from "@/components/error-boundary";
import { WhackamoleTable } from "@/components/scenarioComp/res comp/mole-table";
import { Progress } from "../ui/progress";
import { MuleTable } from "./res comp/mule-table";
import { PartnerTable } from "./res comp/partner-table";
import { TransactionTable } from "./res comp/transaction-table";
import { FlaggedAccountsTable } from "./res comp/geo-account-table";
import { useTranslation } from "react-i18next";
import { LocalBlacklistResults } from "./res comp/local-blacklist-res";

export function Result() {
  const {
    startProgress,
    progress,
    progressMessage,
    activeScenario,
    activeCategory,
  } = ScenarioStore();
  const { t } = useTranslation("common");
  return (
    <Card className="w-full ">
      <CardHeader>
        {startProgress && <Progress value={progress} />}
        <CardTitle>
          {t("results")}: <p className="font-normal">{progressMessage}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary
          fallback={<p className="text-red-600">Failed to load content.</p>}
        >
          {activeScenario === "structuring" ? (
            <div>
              {activeCategory === "detection" ? (
                <div>
                  <MuleTable />
                  <PartnerTable />
                  <TransactionTable />
                </div>
              ) : activeCategory === "nodeGraph" ? (
                <FlowCanvas />
              ) : (
                <div />
              )}
            </div>
          ) : activeScenario === "anomalydetection" ? (
            <AnomalyTable />
          ) : activeScenario === "riskygeographiczones" ? (
            <div>
              <FlaggedAccountsTable /> <FlaggedTransactionsTable />
            </div>
          ) : activeScenario === "blacklist" ? (
            <div>
              {activeCategory === "localDB" ? (
                <div>
                  <LocalBlacklistResults />
                </div>
              ) : activeCategory === "non-SDLListings" ? (
                <Blacklist />
              ) : (
                <div />
              )}
            </div>
          ) : activeScenario === "whackamole" ? (
            <WhackamoleTable />
          ) : null}
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
}

export function SimpleClickableBadges({
  fields,
  onClick,
}: {
  fields: { name: string; label: string; val: boolean }[];
  onClick: (fieldName: string) => void;
}) {
  const { activeScenario, setActiveScenario } = ScenarioStore();
  const { t } = useTranslation("common");
  if (!fields || fields.length === 0) {
    return <p className="text-muted-foreground p-4">No active fields</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("scenarios")}</CardTitle>
        <CardDescription>{t("select_scenario")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap w-full p-4 border rounded-md bg-muted">
          {fields.map((field, index) => {
            const isActive = field.name === activeScenario;

            // Dynamically calculate margin based on field name length
            const scale = 0.08;
            const marginValue = isActive ? field.name.length * scale : 0;

            // Determine if it's an edge item (start of row or end of row)
            const marginLeft = index === 0 ? 0 : marginValue;
            const marginRight = index === fields.length - 1 ? 0 : marginValue;

            return (
              <div className="p-1" key={field.name}>
                <Button
                  className={`
                    transition-all duration-300 ease-in-out
                    ${isActive ? "scale-125 ring-2 ring-white z-10" : "scale-100"}
                    bg-apcolor2 text-gray-50 py-1 px-3 rounded-md shadow-sm cursor-pointer select-none
                    hover:shadow-md hover:bg-apcolor1
                  `}
                  style={{
                    marginLeft: `${marginLeft}rem`,
                    marginRight: `${marginRight}rem`,
                  }}
                  onClick={() => {
                    if (activeScenario === field.name) {
                      setActiveScenario(null);
                    } else {
                      setActiveScenario(field.name);
                    }
                  }}
                >
                  {field.label}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
