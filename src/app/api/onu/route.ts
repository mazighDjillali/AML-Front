import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

const ONU_XML = "https://scsanctions.un.org/resources/xml/en/consolidated.xml";

export async function GET() {
  try {
    const res = await fetch(ONU_XML);
    if (!res.ok) {
      throw new Error("Erreur récupération ONU");
    }
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);
    const list = json.CONSOLIDATED_LIST.INDIVIDUALS.INDIVIDUAL;
    const individuals = Array.isArray(list) ? list : [list];

    const rows = individuals.map((ind: any, id: number) => {
      const first = ind.FIRST_NAME ?? "";
      const second = ind.SECOND_NAME ?? "";
      const third = ind.THIRD_NAME ?? "";
      const fourth = ind.FOURTH_NAME ?? "";
      const fullName = [first, second, third, fourth]
        .filter(Boolean)
        .join(" ");

      const birthdays = ind.DATE_OF_BIRTH;
      let birthday: string | null = null;
      if (birthdays) {
        if (Array.isArray(birthdays)) {
          birthday = birthdays[0].VALUE;
        } else {
          birthday = birthdays.VALUE;
        }
      }

      const nationalities = ind.NATIONALITY;
      let nationality = "";
      if (nationalities) {
        if (Array.isArray(nationalities)) {
          nationality = nationalities.map((n: any) => n.VALUE).join(", ");
        } else {
          nationality = nationalities.VALUE;
        }
      }

      return {
        id,
        reference: ind.REFERENCE_NUMBER ?? ind["@_INDIVIDUAL_ID"] ?? "",
        main_name: fullName,
        birthday,
        nationalities: nationality,
        reason_for_sanction: ind.COMMENTS1 ?? "",
      };
    });

    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error(e);
    return new NextResponse("Erreur ONU", { status: 500 });
  }
}
