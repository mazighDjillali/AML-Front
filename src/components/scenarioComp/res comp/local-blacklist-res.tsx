import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScenarioStore } from "@/stores/scenario-store";

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

export function LocalBlacklistResults() {
  const data = ScenarioStore((s) => s.localBlacklistResults);

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground p-4">No matching records found.</p>
    );
  }

  return (
    <ScrollArea className="h-[500px] w-full rounded-lg border shadow-sm">
      <div className="p-6 space-y-6">
        {data.map((person, i) => {
          return (
            <Card
              key={`${person.reference}-${i}`}
              className="bg-background border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {person.main_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {person.birthday && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Date of Birth
                      </span>
                      <p className="text-sm font-medium">{person.birthday}</p>
                    </div>
                  )}

                  {person.birthplace && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Birthplace
                      </span>
                      <p className="text-sm font-medium">{person.birthplace}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Nationality
                    </span>
                    <p className="text-sm font-medium">
                      {person.nationalities}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Reference
                    </span>
                    <p className="text-sm font-mono text-muted-foreground">
                      {person.reference}
                    </p>
                  </div>
                </div>
                {/* Aliases */}
                {person.aliases && person.aliases.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Aliases
                    </span>
                    <div className="bg-muted/50 rounded-lg p-3">
                      {person.aliases.map((alias, idx) => {
                        const name = [
                          alias.first_name,
                          alias.middle_name,
                          alias.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ");
                        const nameAr = [
                          alias.first_name_ar,
                          alias.middle_name_ar,
                          alias.last_name_ar,
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <div key={idx} className="py-1">
                            {name && (
                              <div className="text-sm font-medium">
                                • {name}
                              </div>
                            )}
                            {nameAr && (
                              <div className="text-sm text-muted-foreground ml-4">
                                {nameAr}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Known Addresses */}
                {person.known_addresses &&
                  person.known_addresses.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Known Addresses
                      </span>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        {person.known_addresses.map((address, idx) => (
                          <div
                            key={idx}
                            className="border-l-2 border-muted-foreground/20 pl-3"
                          >
                            {address.address && (
                              <div className="text-sm font-medium">
                                {address.address}
                              </div>
                            )}
                            {(address.city || address.state) && (
                              <div className="text-sm text-muted-foreground">
                                {[address.city, address.state]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            )}
                            {(address.city_ar || address.state_ar) && (
                              <div className="text-sm text-muted-foreground">
                                {[address.city_ar, address.state_ar]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            )}
                            {address.is_current && (
                              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                                Current Address
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Reason for Sanction */}
                {person.reason_for_sanction &&
                  person.reason_for_sanction !== "N/A" && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Reason for Sanction
                      </span>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">
                          {person.reason_for_sanction}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Description */}
                {person.description && person.description !== "N/A" && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Description
                    </span>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {person.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
