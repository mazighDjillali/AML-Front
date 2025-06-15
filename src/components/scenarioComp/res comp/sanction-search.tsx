import React, { useEffect, useState } from "react";

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
    // Build full name from up to 4 name parts
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

export function SanctionsSearch() {
  const [data, setData] = useState<Individual[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchBy, setSearchBy] = useState<
    "name" | "nationality" | "dob" | "reference"
  >("name");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Individual[] | null>(null);
  // const proxyUrl = "https://cors-anywhere.herokuapp.com/";

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
      } catch (e: any) {
        setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const doSearch = () => {
    if (!query.trim()) {
      alert("Please enter a search value.");
      return;
    }
    const q = query.toLowerCase();

    let filtered: Individual[] = [];
    if (searchBy === "name") {
      filtered = data.filter(
        (ind) =>
          ind.Name.toLowerCase().includes(q) ||
          ind.Aliases.toLowerCase().includes(q),
      );
    } else if (searchBy === "nationality") {
      filtered = data.filter((ind) =>
        ind.Nationality.toLowerCase().includes(q),
      );
    } else if (searchBy === "dob") {
      filtered = data.filter((ind) =>
        ind["Date of Birth"].toLowerCase().includes(q),
      );
    } else if (searchBy === "reference") {
      filtered = data.filter((ind) => ind.Reference.toLowerCase().includes(q));
    }
    setResults(filtered.length > 0 ? filtered : null);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "auto",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <h2>UN Sanctions List Search</h2>
      {loading && <p>Loading sanctions list...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label>
              Search by:{" "}
              <select
                value={searchBy}
                onChange={(e) =>
                  setSearchBy(
                    e.target.value as
                      | "name"
                      | "nationality"
                      | "dob"
                      | "reference",
                  )
                }
              >
                <option value="name">Name or Alias</option>
                <option value="nationality">Nationality</option>
                <option value="dob">Date of Birth</option>
                <option value="reference">Reference Number</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Enter search value"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button onClick={doSearch} style={{ padding: "8px 16px" }}>
            Search
          </button>
          <hr style={{ margin: "20px 0" }} />
          {results === null ? (
            <p>No matches found on the UN sanctions list.</p>
          ) : (
            results.map((ind, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #ccc",
                  padding: 12,
                  marginBottom: 12,
                  borderRadius: 4,
                }}
              >
                <p>
                  <b>Name:</b> {ind.Name}
                </p>
                <p>
                  <b>Aliases:</b> {ind.Aliases}
                </p>
                <p>
                  <b>Date of Birth:</b> {ind["Date of Birth"]}
                </p>
                <p>
                  <b>Nationality:</b> {ind.Nationality}
                </p>
                <p>
                  <b>Comment:</b> {ind.Comment}
                </p>
                <p>
                  <b>Reference:</b> {ind.Reference}
                </p>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
