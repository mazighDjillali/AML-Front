import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScenarioStore } from "@/stores/scenario-store";
import { WavingFlag } from "./waving-flag";
import { countryNameToCode } from "@/lib/countryname-to-code";

export type BlacklistQueryDataType = {
  nameAlias: string | null;

  dob: string | null;

  nationality: string | null;

  reference: string | null;
};

type Individual = {
  Name: string;

  Aliases: string;

  "Date of Birth": string;

  Nationality: string;

  Comment: string;

  Reference: string;
};

const SANCTIONS_URL =
  "https://scsanctions.un.org/resources/xml/fr/consolidated.xml";

const parseXML = (xmlText: string): Individual[] => {
  const parser = new DOMParser();

  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const individuals = Array.from(xmlDoc.querySelectorAll("INDIVIDUAL"));

  return individuals.map((ind) => {
    const nameParts = [
      ind.querySelector("FIRST_NAME")?.textContent || "",

      ind.querySelector("SECOND_NAME")?.textContent || "",

      ind.querySelector("THIRD_NAME")?.textContent || "",

      ind.querySelector("FOURTH_NAME")?.textContent || "",
    ].filter(Boolean);

    const aliases = Array.from(
      ind.querySelectorAll("INDIVIDUAL_ALIAS ALIAS_NAME"),
    )

      .map((el) => el.textContent)

      .filter(Boolean)

      .join(", ");

    const dob =
      ind.querySelector("INDIVIDUAL_DATE_OF_BIRTH DATE")?.textContent || "N/A";

    const nationality =
      ind.querySelector("NATIONALITY VALUE")?.textContent || "N/A";

    const comment = ind.querySelector("COMMENTS1")?.textContent || "N/A";

    const reference =
      ind.querySelector("REFERENCE_NUMBER")?.textContent || "N/A";

    return {
      Name: nameParts.join(" ").trim() || "N/A",

      Aliases: aliases || "N/A",

      "Date of Birth": dob,

      Nationality: nationality,

      Comment: comment,

      Reference: reference,
    };
  });
};

export function Blacklist() {
  const { blacklistQuery } = ScenarioStore();

  const [data, setData] = useState<Individual[]>([]);

  const [filtered, setFiltered] = useState<Individual[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Fetch and parse data on mount

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      setError(null);

      try {
        const res = await fetch(SANCTIONS_URL);

        if (!res.ok) throw new Error("Failed to fetch sanctions list");

        const text = await res.text();

        const parsed = parseXML(text);

        setData(parsed);

        setFiltered(parsed); // initialize filtered with all data
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Run filtering automatically whenever data or blacklistQuery changes

  useEffect(() => {
    if (
      (!blacklistQuery.nameAlias || blacklistQuery.nameAlias.trim() === "") &&
      (!blacklistQuery.dob || blacklistQuery.dob.trim() === "") &&
      (!blacklistQuery.nationality ||
        blacklistQuery.nationality.trim() === "") &&
      (!blacklistQuery.reference || blacklistQuery.reference.trim() === "")
    ) {
      // No filter criteria — show all or empty list as you prefer

      setFiltered(data);

      return;
    }

    const nameAliasQ = (blacklistQuery.nameAlias || "").toLowerCase();

    const dobQ = (blacklistQuery.dob || "").toLowerCase();

    const nationalityQ = (blacklistQuery.nationality || "").toLowerCase();

    const referenceQ = (blacklistQuery.reference || "").toLowerCase();

    const filteredResults = data.filter((ind) => {
      const matchesName =
        nameAliasQ === "" ||
        ind.Name.toLowerCase().includes(nameAliasQ) ||
        ind.Aliases.toLowerCase().includes(nameAliasQ);

      const matchesDob =
        dobQ === "" || ind["Date of Birth"].toLowerCase().includes(dobQ);

      const matchesNationality =
        nationalityQ === "" ||
        ind.Nationality.toLowerCase().includes(nationalityQ);

      const matchesReference =
        referenceQ === "" || ind.Reference.toLowerCase().includes(referenceQ);

      return (
        matchesName && matchesDob && matchesNationality && matchesReference
      );
    });

    setFiltered(filteredResults);
  }, [blacklistQuery, data]);

  return (
    <div className="p-4">
      {/* Removed the search button */}

      {loading && <p className="text-center text-gray-500">Loading data...</p>}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <ScrollArea className="h-[600px] w-full">
          {filtered.length === 0 && (
            <p className="text-center text-gray-600 mt-10">No results found.</p>
          )}

          <div className="grid grid-cols-1 gap-6">
            {filtered.map((ind, i) => {
              if (i > 10) return;

              const countryCode = countryNameToCode(ind.Nationality);

              return (
                <Card key={i} className="shadow-sm hover:shadow-md">
                  <div className="flex flex-row h-fit">
                    {/* Left Side: Info Block */}

                    <div className="flex-1 border-r border-gray-200 p-4 bg-gray-50 overflow-y-auto">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {ind.Name}
                      </h3>

                      <p className="italic text-gray-600 mb-1">
                        Aliases: {ind.Aliases}
                      </p>

                      <p className="mb-1">
                        <strong className="text-gray-700">
                          Date of Birth:
                        </strong>{" "}
                        {ind["Date of Birth"]}
                      </p>

                      <p className="mb-1">
                        <strong className="text-gray-700">Nationality:</strong>{" "}
                        {ind.Nationality}
                      </p>

                      <p className="mb-1">
                        <strong className="text-gray-700">Comment:</strong>{" "}
                        {ind.Comment}
                      </p>

                      <p>
                        <strong className="text-gray-700">Reference:</strong>{" "}
                        {ind.Reference}
                      </p>
                    </div>

                    {/* Right Side: Flag */}

                    <div className="w-80 flex items-center justify-center bg-white">
                      {countryCode ? (
                        <WavingFlag
                          key={`${i}-${countryCode}`}
                          textureUrl={`https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`}
                          width={1000}
                          height={400}
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          No flag available
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
