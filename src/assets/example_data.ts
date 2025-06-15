import { algerianStates } from "@/lib/algerian-states";
import type {
  Anomaly,
  Mule,
  Partner,
  ScenarioDataType,
  TransactionRecord,
} from "@/stores/scenario-store";
import type { Edge, Node } from "@xyflow/react";

const structuringScenario: ScenarioDataType = {
  name: "Structuring",
  uuid: "structuring",
  categories: {
    detection: {
      fields: [
        {
          name: "number_of_mules",
          label: "Number of Mules",
          description:
            "Total number of mules identified in the structuring pattern.",
          type: "number",
          val: 3,
          isRequired: true,
        },
        {
          name: "total_amount",
          label: "Total Amount",
          description:
            "Total transaction amount involved in the structuring scenario.",
          type: "number",
          val: 60000,
          currency: "DZD",
          isRequired: true,
        },
        {
          name: "datetime_range",
          label: "Suspected date range",
          description: "The first and last date to search in.",
          isRequired: true,
          type: "dateTimeRange",
          val: {
            from: new Date("2022-05-01T08:00:00"),
            to: new Date("2026-05-01T08:00:00"),
          },
        },
        {
          name: "mule_account_tx_count",
          label: "Transactions Between Mule and Account",
          description:
            "Number of transactions between a mule and a main account.",
          type: "number",
          val: 2,
          isRequired: true,
        },
      ],
    },
    nodeGraph: {
      fields: [
        {
          type: "text",
          name: "account_id",
          label: "Account identification",
          description:
            "Insert account id to get the network of the individual.",
          isRequired: true,
          val: "1000000002",
          placeholder: "ID...",
        },
        {
          type: "number",
          name: "max_neighbors",
          label: "Maximum number of neighbors.",
          description:
            "How many nodes to include in the graph, not counting the central node.",
          isRequired: false,
          val: 10,
        },
        {
          type: "number",
          name: "transaction_count",
          label: "Transaction frequency",
          description:
            "Number transactions between the central node and it's neighbors",
          isRequired: false,
          val: 1,
          currency: "txn",
        },
        {
          type: "number",
          name: "transaction_amount",
          label: "Transaction amount ",
          description:
            "Total transaction amount between the central node and it's neighbors before flagging",
          isRequired: false,
          val: 1000,
          currency: "txn",
        },
        {
          type: "dropdown",
          name: "transaction_type",
          label: "Transaction type",
          description: "",
          val: "both",
          isRequired: true,
          options: [
            {
              value: "both",
              label: "Both",
            },
            { value: "sent", label: "Sent" },
            { value: "received", label: "Received" },
          ],
        },
        {
          name: "datetime_range",
          label: "Suspected date range",
          description: "The first and last date to search in.",
          isRequired: false,
          type: "dateTimeRange",
          val: {
            from: new Date("2022-05-01T08:00:00"),
            to: new Date("2026-05-01T08:00:00"),
          },
        },
      ],
    },
    aiInsight: {},
  },
};

const anomalyDetectionScenario: ScenarioDataType = {
  name: "Anomaly detection",
  uuid: "anomalydetection",
  categories: {
    account: {
      fields: [
        {
          type: "text",
          name: "accountnum",
          label: "Account number",
          description: "Enter account number. Leave empty to search all.",
          val: "",
          placeholder: "Account number...",
          isRequired: false,
        },
        {
          name: "transaction_amount",
          label: "Transaction amount.",
          currency: "DZD",
          description: "Transaction amount above which to flag a transaction.",
          type: "number",
          val: 10_000,
          isRequired: false,
        },
        {
          type: "number",
          name: "inactivity_duration",
          label: "Months of inactivity",
          description: "Number of months of inactivity before flagging.",
          val: 6,
          isRequired: false,
        },
        {
          type: "dropdown",
          name: "risk",
          label: "Risk",
          description: "Choose a risk level",
          val: "all",
          isRequired: true,
          options: [
            {
              value: "all",
              label: "All",
            },
            { value: "high", label: "High" },
            { value: "moderate", label: "Moderate" },
            { value: "low", label: "Low" },
          ],
        },
        {
          name: "datetime_range",
          label: "Suspected date range",
          description: "The first and last date to search in.",
          isRequired: true,
          type: "dateTimeRange",
          val: {
            from: new Date("2022-05-01T08:00:00"),
            to: new Date("2026-05-01T08:00:00"),
          },
        },
        {
          name: "num_lines",
          label: "Number of rows to display",
          isRequired: false,
          type: "number",
          val: 100,
        },
      ],
    },
  },
};

const whackAMoleScenario: ScenarioDataType = {
  name: "Insider accomplice",
  uuid: "whackamole",
  categories: {
    account: {
      fields: [
        {
          type: "dateTimeRange",
          name: "suspected_time_range",
          label: "Suspected time range",
          description: "Search for transactions only in this time range.",
          isRequired: false,
          val: {
            from: new Date(),
            to: new Date(),
          },
        },
        {
          type: "number",
          name: "freq_before_flag",
          label: "Number of transactions",
          description:
            "Number of transactios with a unique postal worker before flagging.",
          isRequired: false,
          val: 2,
        },
      ],
    },
  },
};

const riskyGeoZonesScenario: ScenarioDataType = {
  name: "Risky geographic zones",
  uuid: "riskygeographiczones",
  categories: {
    transaction: {
      fields: [
        {
          name: "states",
          label: "Choose a state",
          description: "Choose the states in which to flag transactions.",
          type: "multiselectsearchdropdown",
          isRequired: true,
          val: [],
          options: algerianStates,
          placeholder: "Select states...",
        },
      ],
    },
  },
};

const blacklist: ScenarioDataType = {
  name: "Blacklist",
  uuid: "blacklist",
  categories: {
    "non-SDLListings": {
      fields: [
        {
          type: "text",
          name: "name",
          label: "Name or alias",
          description: "",
          isRequired: false,
          placeholder: "...",
          val: "",
        },
        {
          type: "text",
          name: "nationality",
          label: "Nationality",
          description: "",
          isRequired: false,
          placeholder: "...",
          val: "",
        },
        {
          type: "date",
          name: "date_of_birth",
          label: "Date of birth",
          description: "",
          isRequired: false,
          val: null,
        },
        {
          type: "text",
          name: "reference",
          label: "Reference",
          description: "",
          isRequired: false,
          placeholder: "...",
          val: "",
        },
      ],
    },
    localDB: {
      fields: [
        {
          type: "text",
          name: "name",
          label: "Name or alias",
          description: "",
          isRequired: false,
          placeholder: "...",
          val: "",
        },
        {
          type: "text",
          name: "nationality",
          label: "Nationality",
          description: "",
          isRequired: false,
          placeholder: "...",
          val: "",
        },
        {
          type: "date",
          name: "date_of_birth",
          label: "Date of birth",
          description: "",
          isRequired: false,
          val: null,
        },
        {
          type: "text",
          name: "reference",
          label: "Reference",
          description: "",
          isRequired: false,
          placeholder: "...",
          val: "",
        },
      ],
    },
  },
};

export const newScenarios: ScenarioDataType[] = [
  {
    name: "Cash money laundering",
    uuid: "cashMoneyLaundering",
    categories: {
      transaction: {
        baridimob: {
          fields: [
            {
              name: "suspicious_cash_deposits",
              label: "Suspicious Cash Deposits",
              type: "number",
              val: 150000,
              min: 10000,
              max: 500000,
              unit: "DZD",
              currency: "DZD",
              isRequired: true,
            },
            {
              name: "transaction_filter",
              label: "Transaction Date Filter",
              type: "numDateSelect",
              val: {
                number: 20000,
                dateRange: {
                  from: new Date("2023-01-01"),
                  to: new Date("2023-12-31"),
                },
                category: "sent",
              },
              options: [
                { label: "Sent", value: "sent" },
                { label: "Received", value: "received" },
                { label: "Both", value: "both" },
              ],
              currency: "DZD",
              isRequired: false,
            },
          ],
        },
      },
    },
  },

  structuringScenario,

  anomalyDetectionScenario,

  riskyGeoZonesScenario,

  whackAMoleScenario,

  blacklist,

  {
    name: "Financial mule",
    uuid: "financialMule",
    categories: {
      account: {
        gab: {
          fields: [
            {
              name: "account_holder_age",
              label: "Account Holder Age",
              type: "number",
              val: 22,
              min: 18,
              max: 100,
              unit: "years",
              isRequired: true,
            },
            {
              name: "account_type",
              label: "Account Type",
              type: "dropdown",
              val: "personal",
              options: ["personal", "business"],
              isRequired: true,
            },
            {
              name: "employment_status",
              label: "Employment Status",
              type: "text",
              val: "student",
              isRequired: false,
              placeholder: "Status...",
            },
          ],
        },
      },
    },
  },

  {
    name: "Money laundering using inactive accounts",
    uuid: "moneyLaunderingInactiveAccounts",
    categories: {
      account: {
        baridimob: {
          fields: [
            {
              name: "inactive_duration",
              label: "Inactive Duration",
              type: "number",
              val: 18,
              min: 1,
              max: 60,
              unit: "months",
              isRequired: true,
            },
            {
              name: "recent_activity_amount",
              label: "Recent Activity Amount",
              type: "number",
              val: 30000,
              min: 1000,
              max: 500000,
              unit: "DZD",
              isRequired: true,
            },
          ],
        },
      },
    },
  },

  {
    name: "Misappropriation of donations for charitable organizations",
    uuid: "misappropriationDonationsCharitableOrganizations",
    categories: {
      transaction: {
        gab: {
          fields: [
            {
              name: "donation_amount_discrepancy",
              label: "Donation Discrepancy",
              type: "number",
              val: 50000,
              min: 0,
              max: 1000000,
              unit: "DZD",
              isRequired: true,
            },
          ],
        },
      },
      account: {
        poste: {
          fields: [
            {
              name: "organization_type",
              label: "Organization Type",
              type: "dropdown",
              val: "charity",
              options: ["charity", "ngo", "foundation"],
              isRequired: true,
            },
          ],
        },
      },
    },
  },

  {
    name: "Urgent checks",
    uuid: "urgentChecks",
    categories: {
      transaction: {
        poste: {
          fields: [
            {
              name: "high_priority_check_volume",
              label: "High Priority Check Volume",
              type: "number",
              val: 120,
              min: 1,
              max: 500,
              unit: "checks",
              isRequired: true,
            },
            {
              name: "check_processing_time",
              label: "Average Processing Time",
              type: "number",
              val: 1,
              min: 0,
              max: 5,
              unit: "days",
              isRequired: false,
            },
          ],
        },
      },
    },
  },

  {
    name: "Field Showcase",
    uuid: "fieldshowcase",
    categories: {
      numDateSelect: {
        fields: [
          {
            name: "sample_numdateselect",
            label: "Sample Num Date Select",
            type: "numDateSelect",
            val: {
              number: 42,
              dateRange: {
                from: new Date("2024-01-01"),
                to: new Date("2024-12-31"),
              },
              category: "sample",
            },
            options: [
              { label: "Sample", value: "sample" },
              { label: "Other", value: "other" },
            ],
            min: 1,
            max: 100,
            unit: "items",
            currency: "DZD",
            isRequired: true,
          },
        ],
      },
      blacklist: {
        fields: [
          {
            name: "flagged",
            label: "Flagged",
            type: "boolean",
            val: true,
            isRequired: true,
          },
        ],
      },
      transaction: {
        poste: {
          fields: [
            {
              name: "text_example",
              label: "Text Example",
              type: "text",
              val: "demo text",
              isRequired: false,
              placeholder: "Showiest, casiest",
            },
            {
              name: "number_example",
              label: "Number Example",
              type: "number",
              val: 123,
              unit: "kg",
              min: 0,
              max: 1000,
              isRequired: true,
            },
            {
              name: "double_number_example",
              label: "Double Number Example",
              type: "doubleNumber",
              val: { from: 5, to: 10 },
              min: 0,
              max: 20,
              unit: "kg",
              isRequired: true,
            },
            {
              name: "date_time_range",
              label: "Date Time Range",
              type: "dateTimeRange",
              val: {
                from: new Date("2024-06-01"),
                to: new Date("2024-06-30"),
              },
              isRequired: false,
            },
          ],
        },
      },
    },
  },
];

export const fraudData: Mule[] = [
  {
    mule: "MULE001",
    is_fan_out: true,
    is_fan_in: false,
    total_sent: 50000,
    total_received: 10000,
    balance: -40000,
  },
  {
    mule: "MULE002",
    is_fan_out: false,
    is_fan_in: true,
    total_sent: 8000,
    total_received: 20000,
    balance: 12000,
  },
  {
    mule: "MULE003",
    is_fan_out: false,
    is_fan_in: false,
    total_sent: 15000,
    total_received: 15000,
    balance: 0,
  },
];

export const partnerData: Partner[] = [
  {
    mule: "MULE001",
    partner: "PARTNER_A",
    transaction_count: 15,
    total_amount: 25000,
  },
  {
    mule: "MULE001",
    partner: "PARTNER_B",
    transaction_count: 5,
    total_amount: 35000,
  },
  {
    mule: "MULE002",
    partner: "PARTNER_C",
    transaction_count: 10,
    total_amount: 12000,
  },
];

export const anomalies: Anomaly[] = [
  {
    account_number: "1234567890",
    operation_date: "2025-05-15T00:00:00Z",
    amount: 4570.2,
    risk_score: 2,
    risk_label: "Low",
    anomaly_reason_summary: "1 fois opération de nuit",
  },
  {
    account_number: "9876543210",
    operation_date: "2025-04-10T00:00:00Z",
    amount: 11200.75,
    risk_score: 7,
    risk_label: "Moderate",
    anomaly_reason_summary:
      "2 fois montant élevé (≥ 10000 DA); 1 fois ratio élevé (≥ 0.9)",
  },
  {
    account_number: "4567891230",
    operation_date: "2025-03-22T00:00:00Z",
    amount: 9025.5,
    risk_score: 9,
    risk_label: "High",
    anomaly_reason_summary:
      "2 fois ratio élevé (≥ 0.9); 1 fois compte inactif (> 180 jours)",
  },
  {
    account_number: "1122334455",
    operation_date: "2025-02-14T00:00:00Z",
    amount: 3870.0,
    risk_score: 1,
    risk_label: "Low",
    anomaly_reason_summary: "1 fois opération de nuit",
  },
  {
    account_number: "6677889900",
    operation_date: "2025-01-05T00:00:00Z",
    amount: 15800.0,
    risk_score: 10,
    risk_label: "High",
    anomaly_reason_summary:
      "3 fois montant élevé (≥ 10000 DA); 2 fois compte inactif (> 180 jours)",
  },
];

export const transactionRecord: TransactionRecord[] = [
  {
    account_number: "MULE001",
    destination_account: "PARTNER_A",
    amount: 1500,
    operation_date: "2025-05-21",
    operation_time: "14:23:11",
    timestamp: "2025-05-21T14:23:11Z",
    direction: "fan_out",
  },
  {
    account_number: "PARTNER_C",
    destination_account: "MULE002",
    amount: 800,
    operation_date: "2025-05-20",
    operation_time: "09:15:47",
    timestamp: "2025-05-20T09:15:47Z",
    direction: "fan_in",
  },
  {
    account_number: "MULE003",
    destination_account: "PARTNER_B",
    amount: 2000,
    operation_date: "2025-05-22",
    operation_time: "18:05:30",
    timestamp: "2025-05-22T18:05:30Z",
    direction: "fan_out",
  },
];

export const exampleNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 100 },
    data: { label: "Start" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 300, y: 100 },
    data: { label: "Process" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 500, y: 50 },
    data: { label: "Approve?" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 700, y: 0 },
    data: { label: "Approved" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 700, y: 150 },
    data: { label: "Rejected" },
  },
];

export const exampleEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    label: "begin",
    type: "default", // Add this
    animated: true, // Optional: helps make it visible
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    label: "review",
    type: "default",
    animated: true,
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    label: "yes",
    type: "default",
    animated: true,
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    label: "no",
    type: "default",
    animated: true,
  },
];
