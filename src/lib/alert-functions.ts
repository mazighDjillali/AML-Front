import type {
  StructuringAlert,
  AnomalyDetection,
  WackAMole,
  Blacklist,
  BaseAlert,
  AlertType,
  RiskyGeoZones,
} from "@/stores/scenario-store";
import type { ScenarioStore } from "@/stores/scenario-store";

type ScenarioData = ScenarioStore;

export function getStructuringAlertData(data: ScenarioData): StructuringAlert {
  const { fraudData, partnerData, transactionRecord } = data;

  const fraudsterAccounts = new Set(fraudData.map((f) => f.mule));
  const fraudsterCount = fraudData.length;

  const totalPartners = new Set(
    partnerData
      .filter((p) => fraudsterAccounts.has(p.mule))
      .map((p) => p.partner),
  ).size;

  const totalTransactionAmount = fraudData.reduce(
    (sum, f) => sum + f.total_sent + f.total_received,
    0,
  );

  const fanOutAccounts = fraudData.filter((f) => f.is_fan_out).length;
  const fanInAccounts = fraudData.filter((f) => f.is_fan_in).length;

  const averageFanOutAmount = fanOutAccounts
    ? fraudData
        .filter((f) => f.is_fan_out)
        .reduce((sum, f) => sum + f.total_sent, 0) / fanOutAccounts
    : 0;

  const averageFanInAmount = fanInAccounts
    ? fraudData
        .filter((f) => f.is_fan_in)
        .reduce((sum, f) => sum + f.total_received, 0) / fanInAccounts
    : 0;

  const totalTransactions = transactionRecord.filter(
    (tr) =>
      fraudsterAccounts.has(tr.account_number) ||
      fraudsterAccounts.has(tr.destination_account),
  ).length;

  return {
    type: "structuring",
    fraudsterCount,
    totalPartners,
    totalTransactionAmount,
    averageFanOutAmount,
    averageFanInAmount,
    fanInAccounts,
    fanOutAccounts,
    totalTransactions,
    timestamp: new Date(),
  };
}

export function getAnomalyDetectionData(data: ScenarioData): AnomalyDetection {
  const { anomalyData } = data;

  const totalAnomalies = anomalyData.length;
  const highRiskCount = anomalyData.filter(
    (a) => a.risk_label === "High",
  ).length;
  const moderateRiskCount = anomalyData.filter(
    (a) => a.risk_label === "Moderate",
  ).length;
  const lowRiskCount = anomalyData.filter((a) => a.risk_label === "Low").length;
  const totalAccountsInvolved = new Set(
    anomalyData.map((a) => a.account_number),
  ).size;

  return {
    type: "anomalydetection",
    totalAnomalies,
    highRiskCount,
    moderateRiskCount,
    lowRiskCount,
    totalAccountsInvolved,
    timestamp: new Date(),
  };
}

export function getWackAMoleData(data: ScenarioData): WackAMole {
  const { moleData } = data;

  const totalSequences = moleData.length;
  const uniqueAccountsInvolved = new Set(
    moleData.map((tx) => tx.account_number),
  ).size;

  const totalAmount = moleData.reduce((sum, tx) => sum + tx.amount, 0);
  const averageTransactionAmount = totalSequences
    ? totalAmount / totalSequences
    : 0;

  const flaggedObservationCount = moleData.filter(
    (tx) => tx.observation != null,
  ).length;
  const highTaxTransactions = moleData.filter(
    (tx) => tx.tax && tx.tax > 10000,
  ).length;

  return {
    type: "whackamole",
    totalSequences,
    uniqueAccountsInvolved,
    averageTransactionAmount,
    flaggedObservationCount,
    highTaxTransactions,
    timestamp: new Date(),
  };
}

export function getBlacklistData(data: ScenarioData): Blacklist {
  const { localBlacklistResults, flaggedAccounts, flaggedTransactions } = data;

  const matchedEntities = localBlacklistResults.length;

  const aliasMatches = localBlacklistResults.reduce(
    (sum, b) => sum + (b.aliases?.length || 0),
    0,
  );

  const countriesInvolved = Array.from(
    new Set(
      localBlacklistResults
        .map((b) => b.nationalities)
        .filter((c): c is string => Boolean(c)),
    ),
  );

  return {
    type: "blacklist",
    matchedEntities,
    aliasMatches,
    countriesInvolved,
    flaggedAccounts: flaggedAccounts.length,
    flaggedTransactions: flaggedTransactions.length,
    timestamp: new Date(),
  };
}

export function getRiskyGeoZonesData(data: ScenarioData): RiskyGeoZones {
  const { flaggedTransactions, flaggedAccounts } = data;

  const uniqueAccounts = new Set(flaggedAccounts.map((fa) => fa.account));
  const allFlaggedStates = flaggedTransactions.flatMap(
    (tx) => tx.flagged_states,
  );

  const suspiciousZones = Array.from(new Set(allFlaggedStates));

  const transactionsFromRiskZones = flaggedTransactions.length;
  const totalAmountFromRiskZones = flaggedTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );

  return {
    type: "riskygeographiczones",
    affectedAccounts: uniqueAccounts.size,
    suspiciousZones,
    transactionsFromRiskZones,
    totalAmountFromRiskZones,
    timestamp: new Date(),
  };
}

export function getAlertData(
  type: BaseAlert["type"],
  data: ScenarioData,
): AlertType {
  switch (type) {
    case "structuring":
      return getStructuringAlertData(data);
    case "anomalydetection":
      return getAnomalyDetectionData(data);
    case "whackamole":
      return getWackAMoleData(data);
    case "blacklist":
      return getBlacklistData(data);
    case "riskygeographiczones":
      return getRiskyGeoZonesData(data);
    default:
      throw new Error(`Unknown alert type: ${type}`);
  }
}
