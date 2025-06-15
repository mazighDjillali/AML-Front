import { memo, useEffect } from "react";
import { ScenarioStore } from "@/stores/scenario-store";
import { ENDPOINT_PROGRESS } from "@/lib/constants";
import { toast as toastThingy } from "sonner";

export const ProgressTracker = memo(() => {
  const backendTaskIDForActiveScenario = ScenarioStore(
    (s) => s.backendTaskIDForActiveScenario,
  );
  const setProgress = ScenarioStore((s) => s.setProgress);
  const setProgressState = ScenarioStore((s) => s.setProgressState);
  const setProgressMessage = ScenarioStore((s) => s.setProgressMessage);
  const startProgress = ScenarioStore((s) => s.startProgress);
  const {
    activeScenario,
    setAnomalyData,
    setFraudData,
    setPartnerData,
    setTransactionRecord,
    setFlaggedAccounts,
    setFlaggedTransactions,
    setGraphNodesData,
    setMoleData,
    activeCategory,
    setLocalBlacklistResults,
    raiseAlert,
  } = ScenarioStore();

  //console.log("rerenders");

  useEffect(() => {
    if (
      !backendTaskIDForActiveScenario ||
      backendTaskIDForActiveScenario === "" ||
      !startProgress
    ) {
      return;
    }

    const interval = setInterval(() => {
      fetch(`${ENDPOINT_PROGRESS}${backendTaskIDForActiveScenario}/`)
        .then((res) => res.json())
        .then((data) => {
          //console.log("Progress polling result: ", data);

          const status = data.status;

          if (status === "PROGRESS") {
            if (!startProgress) setProgressState(true);
            setProgress(data.progress || 0);
            setProgressMessage(data.message || "Processing...");
          } else if (status === "SUCCESS") {
            setProgressState(false);
            setProgress(100);
            setProgressMessage("Results: ");
            //console.log(data.result);
            if (activeScenario === "structuring") {
              if (activeCategory === "detection") {
                setFraudData(data.result.mules);
                setTransactionRecord(data.result.transaction_list);
                setPartnerData(data.result.partners);
              } else if (activeCategory === "nodeGraph") {
                setGraphNodesData(data.result);
              }
            } else if (activeScenario === "anomalydetection") {
              setAnomalyData(data.result.anomalies);
            } else if (activeScenario === "riskygeographiczones") {
              setFlaggedAccounts(data.result.flagged_accounts);
              setFlaggedTransactions(data.result.flagged_transactions);
            } else if (activeScenario === "whackamole") {
              setMoleData(data.result.mole_suspects);
            } else if (activeScenario === "blacklist") {
              //console.log(
                "We got this data from blacklist local: ",
                data.result,
              );
              setLocalBlacklistResults(data.result.blacklistdata);
            }
            toastThingy.success("Task finished successfully.");
            console.error("Raising the alert");
            raiseAlert(activeScenario);

            clearInterval(interval);
          } else if (status === "FAILURE") {
            setProgressMessage(
              "An error has occurred. Check logs for details.",
            );
            setProgressState(false);
            setProgress(0);
            toastThingy.error("Task failed. Check logs for details.");
            console.error(`Task error: ${data.error}`);
            clearInterval(interval);
          } else if (status === "PENDING") {
            setProgressMessage("Waiting for task to start...");
          } else {
            setProgressMessage(`Unknown status: ${status}`);
          }
        })

        .catch((err) => {
          console.error("Error fetching progress:", err);
          setProgressMessage("Could not fetch progress");
          setProgressState(false);
          setProgress(0);
          toastThingy.error("Could not fetch progress");
          clearInterval(interval);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    backendTaskIDForActiveScenario,
    setProgress,
    setProgressState,
    setProgressMessage,
    startProgress,
    activeScenario,
    setFraudData,
    setTransactionRecord,
    setPartnerData,
    setAnomalyData,
    setFlaggedAccounts,
    setFlaggedTransactions,
    setGraphNodesData,
  ]);

  return null; // no visible UI
});
