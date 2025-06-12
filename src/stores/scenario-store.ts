import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { getLayoutedElements } from "@/lib/node-layer";
import { newScenarios } from "@/assets/example_data";
import { AlertTriangle, Ban, MapPin, Shield, Target } from "lucide-react";
import { getAlertData } from "@/lib/alert-functions";
import { ENDPOINT_SCENARIO } from "@/lib/constants";
import { toast as toastThingy } from "sonner";

// Define the transaction mediums
export type TransactionMedium = "baridimob" | "poste" | "gab";
export const transactionMediums: TransactionMedium[] = [
  "baridimob",
  "poste",
  "gab",
];

// Updated scenario categories
export type ScenarioCategories =
  | "transaction"
  | "account"
  | "blacklist"
  | "numDateSelect"
  | "detection"
  | "nodeGraph"
  | "non-SDLListings"
  | "localDB";

export const scenarioCategories: ScenarioCategories[] = [
  "transaction",
  "account",
  "blacklist",
  "numDateSelect",
  "detection",
  "nodeGraph",
  "non-SDLListings",
  "localDB",
];

// Base field type
export type BaseField = {
  name: string;
  label: string;
  description?: string;
  isRequired: boolean;
  val: unknown;
  error?: string;
};

export type NumberField = BaseField & {
  type: "number";
  val: number;
  min?: number;
  max?: number;
  unit?: string;
  currency?: string;
};

export type TextField = BaseField & {
  type: "text";
  val: string;
  placeholder: string;
};

export type DropdownField<T = unknown> = BaseField & {
  type: "dropdown";
  val: string;
  options: T[];
};

export type SearchDropdownField = BaseField & {
  type: "searchdropdown";
  val: string;
  options: {
    name: string;
    label: string;
  }[];
};

export type MultiSelectSearchDropdownField = BaseField & {
  type: "multiselectsearchdropdown";
  val: string[];
  options: {
    name: string;
    label: string;
  }[];
  placeholder: string;
};
export type NumDateSelectField = BaseField & {
  type: "numDateSelect";
  val: {
    number: number;
    dateRange: {
      from: Date;
      to: Date;
    };
    category: string;
  };
  options?: {
    label: string;
    value: string;
  }[];
  min?: number;
  max?: number;
  unit?: string;
  currency?: string;
};

export type DateField = BaseField & {
  type: "date";
  val: Date | null;
};

export type DateTimeRangeField = BaseField & {
  type: "dateTimeRange";
  val: {
    from: Date | null;
    to: Date | null;
  };
};

export type BooleanField = BaseField & {
  type: "boolean";
  val: boolean;
};

export type NumberDateTimeRangeField = BaseField & {
  type: "numberDateTimeRange";
  val: {
    number: number;
    dateTimeRange: {
      from: Date | null;
      to: Date | null;
    };
  };
  min?: number;
  max?: number;
  unit?: string;
  currency?: string;
};

export type DoubleNumberField = BaseField & {
  type: "doubleNumber";
  val: {
    from: number;
    to: number;
  };
  min?: number;
  max?: number;
  unit?: string;
  currency?: string;
};

export type DoubleNumberDateRangeField = BaseField & {
  type: "doubleNumberDateRange";
  val: {
    firstNumber: number;
    secondNumber: number;
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
  };
  minFirst?: number;
  maxFirst?: number;
  minSecond?: number;
  maxSecond?: number;
  units?: {
    first?: string;
    second?: string;
  };
  labels?: {
    first: string;
    second: string;
  };
};

export type DateTime = BaseField & {
  type: "datetime";
  val: Date | null;
};
export type DateTimeDuration = BaseField & {
  type: "dateTimeDuration";
  val: Date | null;
};

export type BadgeSelectType = BaseField & {
  type: "badgeselect";
  options: {
    label: string;
    name: string;
  }[];
  val: string[];
};

export type Field =
  | NumberField
  | TextField
  | DropdownField
  | NumDateSelectField
  | DateTimeRangeField
  | BooleanField
  | DoubleNumberField
  | NumberDateTimeRangeField
  | DoubleNumberDateRangeField
  | DateTime
  | SearchDropdownField
  | MultiSelectSearchDropdownField
  | DateTimeDuration
  | DateField
  | BadgeSelectType;

export type ScenarioDataType = {
  name: string;
  uuid: string;
  categories: {
    transaction?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
    account?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
    blacklist?: {
      fields: Field[];
    };
    numDateSelect?: {
      fields: Field[];
    };

    detection?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
    nodeGraph?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
    localDB?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
    "non-SDLListings"?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
    aiInsight?:
      | {
          [key in TransactionMedium]?: {
            fields: Field[];
          };
        }
      | {
          fields: Field[];
        };
  };
};

export interface MulePartner {
  partner: string;
  transaction_count: number;
  total_amount: number;
}

export interface Mule {
  mule: string; // Mule account number
  is_fan_out: boolean; // Whether identified as fan-out mule
  is_fan_in: boolean; // Whether identified as fan-in mule
  total_sent: number; // Total amount sent
  total_received: number; // Total amount received
  balance: number; // total_received - total_sent
  // partners: MulePartner[];       // Detailed interaction with partners
}

export interface Partner {
  mule: string; // ID of the mule
  partner: string; // ID of the associated partner
  transaction_count: number; // Number of transactions with this partner
  total_amount: number; // Total amount transacted
}

export interface TransactionRecord {
  account_number: string; // Sender
  destination_account: string; // Receiver
  amount: number; // Transaction amount
  operation_date: string; // Original date (YYYY-MM-DD)
  operation_time: string; // Original time (HH:MM:SS)
  timestamp: string; // Combined datetime (ISO string)
  direction: "fan_in" | "fan_out"; // Direction of the transaction
}

export interface Anomaly {
  account_number: string;
  operation_date: string; // ISO format string, e.g., "2025-05-15T00:00:00"
  amount: number;
  risk_score: number;
  risk_label: "Low" | "Moderate" | "High";
  anomaly_reason_summary: string;
}

export type FlaggedTransaction = {
  account_number: string;
  destination_account: string;
  operation_date: string;
  amount: number;
  flagged_states: string[];
};

export type FlaggedAccount = {
  account: string;
  flagged_states: string[];
  flag_count: number;
};

export type MolyTransactionType = {
  sequence: number;
  operation_date: string; // ISO date string (e.g., '2025-03-17')
  operation_time: string; // ISO time string (e.g., '07:42:52')
  operation_code: string;
  amount: number;
  tax: number;
  destination_account: string;
  old_balance: number;
  old_balance_date: string; // ISO date string
  new_balance: number;
  designation: string;
  x: number | null;
  code: string;
  y: number | null;
  number: number;
  observation: string | null;
  account_number: string;
};

export type AccountNodeData = {
  edges: Edge[];
  nodes: Node[];
};

export type BlacklistQueryDataType = {
  nameAlias: string | null;
  dob: string | null;
  nationality: string | null;
  reference: string | null;
};

export interface Alias {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  first_name_ar: string | null;
  middle_name_ar: string | null;
  last_name_ar: string | null;
  is_alias: boolean;
}

export interface KnownAddress {
  address: string | null;
  is_current: boolean | null;
  state: string | null;
  city: string | null;
  state_ar: string | null;
  city_ar: string | null;
}

export interface BlacklistResult {
  reference: string;
  birthday: string | null;
  birthplace: string | null;
  reason_for_sanction: string | null;
  main_name: string;
  nationalities: string;
  aliases: Alias[];
  known_addresses: KnownAddress[];
  description: string;
}

export type BaseAlert = {
  type:
    | "structuring"
    | "anomalydetection"
    | "riskygeographiczones"
    | "whackamole"
    | "blacklist";
  timestamp?: Date;
};
export type StructuringAlert = BaseAlert & {
  fraudsterCount: number; // number of identified fan-in/fan-out nodes
  totalPartners: number; // number of unique partner accounts
  totalTransactionAmount: number; // sum of all sent/received
  averageFanOutAmount: number;
  averageFanInAmount: number;
  fanInAccounts: number; // how many fraudsters are fan-in
  fanOutAccounts: number; // how many are fan-out
  totalTransactions: number; // number of related transactions
};

export type AnomalyDetection = BaseAlert & {
  totalAnomalies: number;
  highRiskCount: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  totalAccountsInvolved: number;
};

export type RiskyGeoZones = BaseAlert & {
  affectedAccounts: number;
  suspiciousZones: string[]; // List of cities or states (from known_addresses)
  transactionsFromRiskZones: number;
  totalAmountFromRiskZones: number;
};

export type WackAMole = BaseAlert & {
  totalSequences: number;
  uniqueAccountsInvolved: number;
  averageTransactionAmount: number;
  flaggedObservationCount: number; // How many have non-null `observation`
  highTaxTransactions: number; // Transactions with unusually high tax
};

export type Blacklist = BaseAlert & {
  matchedEntities: number; // Number of blacklistResults
  aliasMatches: number; // Count of aliases across results
  countriesInvolved: string[]; // Unique nationalities
  flaggedAccounts: number;
  flaggedTransactions: number;
};

export type AlertType =
  | StructuringAlert
  | RiskyGeoZones
  | WackAMole
  | Blacklist
  | AnomalyDetection;

export type AlertTypeString =
  | "structuring"
  | "anomalydetection"
  | "whackamole"
  | "blacklist"
  | "riskygeographiczones";

export type AlertMeta = {
  type: AlertTypeString;
  category: ScenarioCategories;
  title: string;
  icon: React.ComponentType<any>;
  gradient: string;
};
export const alertTypes: AlertMeta[] = [
  {
    type: "structuring",
    category: "detection",
    title: "Structuring Detection",
    icon: AlertTriangle,
    gradient: "from-red-500 to-pink-600",
  },
  {
    type: "anomalydetection",
    category: "account",
    title: "Anomaly Detection",
    icon: Shield,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    type: "whackamole",
    category: "account",
    title: "Insider Accomplice",
    icon: Target,
    gradient: "from-green-500 to-emerald-600",
  },
  // {
  //   type: "blacklist",
  //   category: "non-SDLListings",
  //   title: "Blacklist Monitoring",
  //   icon: Ban,
  //   gradient: "from-gray-700 to-gray-900",
  // },
  {
    type: "blacklist",
    category: "localDB",
    title: "Blacklist Monitoring",
    icon: Ban,
    gradient: "from-gray-700 to-gray-900",
  },
  {
    type: "riskygeographiczones",
    category: "transaction",
    title: "Risky Geographic Zones",
    icon: MapPin,
    gradient: "from-purple-500 to-violet-600",
  },
];
export interface ScenarioStore {
  submitScenarioWithDefaults: (
    scenarioId: string,
    categoryName?: string,
  ) => void;
  sendScenario: (payload: unknown) => void;

  alertsData: Record<AlertTypeString, any>;
  loadingTypes: Set<AlertTypeString>;
  raiseAlert: (type: AlertTypeString) => Promise<void>;

  alerts: AlertType[];

  localBlacklistResults: BlacklistResult[];
  setLocalBlacklistResults: (data: BlacklistResult[]) => void;

  activeCategory?: string;
  setActiveCategory: (category?: string) => void;

  blacklistQuery: BlacklistQueryDataType;
  setBlacklistQuery: (data: BlacklistQueryDataType) => void;

  getEdges: () => Edge[];
  getNodes: () => Node[];
  edges: Edge[];
  nodes: Node[];
  setGraphNodesData: (data: AccountNodeData) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  moleData: MolyTransactionType[];
  setMoleData: (data: MolyTransactionType[]) => void;

  flaggedTransactions: FlaggedTransaction[];
  flaggedAccounts: FlaggedAccount[];

  setFlaggedTransactions: (data: FlaggedTransaction[]) => void;
  setFlaggedAccounts: (data: FlaggedAccount[]) => void;
  selectedAccount: string | null;

  selectedTransaction: string | null;
  setSelectedAccount: (id: string | null) => void;
  setSelectedTransaction: (id: string | null) => void;

  anomalyData: Anomaly[];
  setAnomalyData: (data: Anomaly[]) => void;

  fraudData: Mule[];
  partnerData: Partner[];
  transactionRecord: TransactionRecord[];

  setSelectedMule: (id: string | null) => void;
  selectedMule: string | null;

  setSelectedPartner: (id: string | null) => void;
  selectedPartner: string | null;

  setFraudData: (data: Mule[]) => void;
  setPartnerData: (data: Partner[]) => void;
  setTransactionRecord: (data: TransactionRecord[]) => void;

  scenarioData: ScenarioDataType[];
  getScenarioById: (id: string | null) => ScenarioDataType | null;
  getScenarioByName: (name: string) => ScenarioDataType | null;
  activeScenario: string | null;
  setActiveScenario: (scenarioId: string | null) => void;
  resetStore: () => void;
  updateFieldValues: (
    category: string,
    fieldName: string,
    value: any,
    medium?: string,
  ) => void;

  scenarioLoadingState: boolean;
  setScenarioLoadingState: (newState: boolean) => void;

  apiMessage: string;
  setApiMessage: (newMessage: string) => void;

  startProgress: boolean;
  progress: number;
  progressMessage: string;

  setProgressState: (newState: boolean) => void;
  setProgress: (newProgress: number) => void;
  setProgressMessage: (newMessage: string) => void;

  backendTaskIDForActiveScenario: string;
  setBackendTaskIDForActiveScenario: (id: string) => void;
}

const initialState: Omit<
  ScenarioStore,
  | "getScenarioById"
  | "getScenarioByName"
  | "setActiveScenario"
  | "resetStore"
  | "updateFieldValues"
  | "setScenarioLoadingState"
  | "setApiMessage"
  | "setProgressState"
  | "setProgress"
  | "setProgressMessage"
  | "setBackendTaskIDForActiveScenario"
  | "setFraudData"
  | "setPartnerData"
  | "setTransactionRecord"
  | "setSelectedMule"
  | "setSelectedPartner"
  | "setAnomalyData"
  | "setFlaggedTransactions"
  | "setFlaggedAccounts"
  | "setSelectedAccount"
  | "setSelectedTransaction"
  | "setMoleData"
  | "setGraphNodesData"
  | "setNodes"
  | "setEdges"
  | "onEdgesChange"
  | "onNodesChange"
  | "getEdges"
  | "getNodes"
  | "setBlacklistQuery"
  | "setActiveCategory"
  | "setLocalBlacklistResults"
  | "raiseAlert"
> = {
  alertsData: {},
  loadingTypes: new Set<AlertTypeString>([
    "structuring",
    "anomalydetection",
    "whackamole",
    "blacklist",
    "riskygeographiczones",
  ]),
  localBlacklistResults: [],
  activeCategory: undefined,
  blacklistQuery: {
    nameAlias: null,
    dob: null,
    nationality: null,
    reference: null,
  },

  nodes: [],
  edges: [],

  moleData: [],
  flaggedAccounts: [],
  flaggedTransactions: [],
  selectedAccount: null,
  selectedTransaction: null,
  anomalyData: [],

  fraudData: [],
  partnerData: [],
  transactionRecord: [],

  selectedMule: null,
  selectedPartner: null,

  scenarioData: newScenarios,
  activeScenario: "structuring",
  scenarioLoadingState: false,
  apiMessage: "",

  startProgress: false,
  progress: 0,
  progressMessage: "",

  backendTaskIDForActiveScenario: "",
};

export const ScenarioStore = create<ScenarioStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        submitScenarioWithDefaults: async (
          scenarioId: string,
          categoryName?: string,
        ) => {
          const state = get();
          const scenario = state.getScenarioById(scenarioId);

          if (!scenario) {
            console.error("Scenario not found:", scenarioId);
            return;
          }

          // Set the active scenario and category
          set({ activeScenario: scenarioId });
          if (categoryName) {
            set({ activeCategory: categoryName });
          }

          // Build payload with default values
          const result: any = {
            scenario: {
              name: scenario.name,
              categories: {},
            },
            activeCategory: categoryName || Object.keys(scenario.categories)[0],
          };

          // Populate with default values
          for (const [catName, categoryData] of Object.entries(
            scenario.categories,
          )) {
            if (!categoryData) continue;

            if ("fields" in categoryData) {
              // Flat category with fields array
              const fieldsWithDefaults = categoryData.fields.map(
                (field: any) => ({
                  ...field,
                  val: getDefaultValueFromField(field),
                }),
              );
              result.scenario.categories[catName] = {
                fields: fieldsWithDefaults,
              };
            } else {
              // Medium-based category
              result.scenario.categories[catName] = {};
              for (const [medium, mediumData] of Object.entries(categoryData)) {
                if (mediumData && "fields" in mediumData) {
                  const fieldsWithDefaults = mediumData.fields.map(
                    (field: any) => ({
                      ...field,
                      val: getDefaultValueFromField(field),
                    }),
                  );
                  result.scenario.categories[catName][medium] = {
                    fields: fieldsWithDefaults,
                  };
                }
              }
            }
          }

          // Handle blacklist scenario special case
          if (
            scenarioId === "blacklist" &&
            categoryName === "non-SDLListings"
          ) {
            const fields = result.scenario.categories["non-SDLListings"].fields;

            const getFieldValue = (fieldName: string): string | null => {
              const field = fields.find((f: any) => f.name === fieldName);
              if (!field) return null;

              if (field.type === "date" && field.val) {
                return new Date(field.val).toISOString().split("T")[0];
              }

              if (field.type === "badgeselect") {
                return Array.isArray(field.val) ? field.val : [];
              }

              return field.val || null;
            };

            state.setBlacklistQuery({
              nameAlias: getFieldValue("name") || null,
              dob: getFieldValue("date_of_birth") || null,
              nationality: getFieldValue("nationality") || null,
              reference: getFieldValue("reference") || null,
            });

            return;
          }

          // Submit the scenario
          await state.sendScenario(result);
        },

        // Helper method to send scenario (extract from your component)
        sendScenario: async (payload: unknown) => {
          const state = get();
          try {
            state.setScenarioLoadingState(true);
            state.setApiMessage("API request sent.");

            const response = await fetch(ENDPOINT_SCENARIO, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { task_id, status, scenario, toast } = await response.json();

            state.setApiMessage("Scenario sent successfully!");
            state.setBackendTaskIDForActiveScenario(task_id);
            state.setProgressState(true);
            toastThingy.info(toast);
          } catch (error) {
            console.error("Error sending scenario:", error);
            state.setApiMessage(`Error sending scenario: ${error}`);
          } finally {
            state.setScenarioLoadingState(false);
          }
        },

        raiseAlert: async (type: AlertTypeString) => {
          const { alertsData } = get();
          const scenario = ScenarioStore.getState();

          if (alertsData[type]) return;

          const data: AlertType = await new Promise((resolve) =>
            setTimeout(() => resolve(getAlertData(type, scenario)), 500),
          );

          set((state) => ({
            alertsData: { ...state.alertsData, [type]: data },
          }));
        },

        setLocalBlacklistResults: (data) =>
          set({ localBlacklistResults: data }),
        setActiveCategory: (cat) => set({ activeCategory: cat }),
        setBlacklistQuery: (data) => set({ blacklistQuery: data }),
        getEdges: () => {
          return get().edges;
        },
        getNodes: () => {
          return get().nodes;
        },

        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),
        onNodesChange: (changes) =>
          set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
        onEdgesChange: (changes) =>
          set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
        setGraphNodesData: (data) => {
          console.log("setting this data: ", data);
          console.log("nodes: ", data.nodes);
          console.log("edges: ", data.edges);
          const { nodes, edges } = getLayoutedElements(data.nodes, data.edges);
          get().setNodes(nodes);
          get().setEdges(edges);
        },
        setMoleData: (data) => set({ moleData: data }),
        setFlaggedTransactions: (data) => set({ flaggedTransactions: data }),
        setFlaggedAccounts: (data) => set({ flaggedAccounts: data }),
        setSelectedAccount: (id) =>
          set({ selectedAccount: id, selectedTransaction: null }),
        setSelectedTransaction: (id) =>
          set({ selectedTransaction: id, selectedAccount: null }),
        setAnomalyData: (data) => set({ anomalyData: data }),
        setSelectedMule: (id) => set({ selectedMule: id }),
        setSelectedPartner: (id) => set({ selectedPartner: id }),
        setFraudData: (data) => set({ fraudData: data }),
        setPartnerData: (data) => set({ partnerData: data }),
        setTransactionRecord: (data) => set({ transactionRecord: data }),
        getScenarioById: (id) => {
          if (!id) return;
          const data =
            get().scenarioData.find((scen) => {
              return scen.uuid === id;
            }) ?? null;
          return data;
        },
        getScenarioByName: (name) => {
          const data =
            get().scenarioData.find((scen) => scen.name === name) ?? null;
          return data;
        },
        setActiveScenario: (scenarioId) => {
          set({ activeScenario: scenarioId });
        },
        resetStore: () => {
          set({ ...initialState });
        },
        setScenarioLoadingState: (newState) => {
          set({ scenarioLoadingState: newState });
        },
        setApiMessage: (newMessage) => {
          set({ apiMessage: newMessage });
        },
        setProgress: (newProgress) => {
          set({ progress: newProgress });
        },
        setProgressMessage: (newMessage) => {
          set({ progressMessage: newMessage });
        },
        setProgressState: (newState) => {
          set({ startProgress: newState });
        },

        setBackendTaskIDForActiveScenario: (id) => {
          set({ backendTaskIDForActiveScenario: id });
        },

        updateFieldValues: (category, fieldName, value, medium) =>
          set((state) => {
            const scenarioIndex = state.scenarioData.findIndex(
              (s) => s.uuid === state.activeScenario,
            );

            if (scenarioIndex === -1) return {};

            const activeScenario = state.scenarioData[scenarioIndex];

            const updatedScenario = structuredClone(activeScenario);
            const cat =
              updatedScenario.categories[category as ScenarioCategories];

            if (!cat) return {};

            if (category === "transaction" || category === "account") {
              if (!medium || !(medium in cat)) return {};

              const fields = cat[medium as TransactionMedium]?.fields || [];
              const fieldIndex = fields.findIndex((f) => f.name === fieldName);

              if (fieldIndex === -1) return {};

              fields[fieldIndex] = {
                ...fields[fieldIndex],
                val: value,
              };

              (cat as any)[medium].fields = fields;
            } else {
              const fields = (cat as any).fields || [];
              const fieldIndex = fields.findIndex((f) => f.name === fieldName);

              if (fieldIndex === -1) return {};

              fields[fieldIndex] = {
                ...fields[fieldIndex],
                val: value,
              };

              (cat as any).fields = fields;
            }

            const newScenarioData = [...state.scenarioData];
            newScenarioData[scenarioIndex] = updatedScenario;

            return {
              scenarioData: newScenarioData,
            };
          }),
      }),
      {
        name: "scenario-store",
      },
    ),
  ),
);

function getDefaultValueFromField(field: any): any {
  // Use the existing val property from the scenario data as the default
  return field.val;
}
