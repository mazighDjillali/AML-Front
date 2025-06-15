export const countryNameToCode = (country: string): string | null => {
  const map: Record<string, string> = {
    Afghanistan: "AF",

    Albania: "AL",

    Algeria: "DZ",

    "United States": "US",

    Andorra: "AD",

    Angola: "AO",

    Argentina: "AR",

    Armenia: "AM",

    Australia: "AU",

    Austria: "AT",

    Azerbaijan: "AZ",

    Bahamas: "BS",

    Bahrain: "BH",

    Bangladesh: "BD",

    Barbados: "BB",

    Belarus: "BY",

    Belgium: "BE",

    Belize: "BZ",

    Benin: "BJ",

    Bhutan: "BT",

    Bolivia: "BO",

    "Bosnia and Herzegovina": "BA",

    Botswana: "BW",

    Brazil: "BR",

    "United Kingdom": "GB",

    Brunei: "BN",

    Bulgaria: "BG",

    "Burkina Faso": "BF",

    Myanmar: "MM",

    Burundi: "BI",

    Cambodia: "KH",

    Cameroon: "CM",

    Canada: "CA",

    "Cape Verde": "CV",

    "Central African Republic": "CF",

    Chad: "TD",

    Chile: "CL",

    China: "CN",

    Colombia: "CO",

    Comoros: "KM",

    "Republic of the Congo": "CG",

    "Democratic Republic of the Congo": "CD",

    "Costa Rica": "CR",

    Croatia: "HR",

    Cuba: "CU",

    Cyprus: "CY",

    Czechia: "CZ",

    Denmark: "DK",

    Djibouti: "DJ",

    "Dominican Republic": "DO",

    Netherlands: "NL",

    "East Timor": "TL",

    Ecuador: "EC",

    Egypt: "EG",

    UAE: "AE",

    England: "GB",

    "Equatorial Guinea": "GQ",

    Eritrea: "ER",

    Estonia: "EE",

    Ethiopia: "ET",

    Fiji: "FJ",

    Philippines: "PH",

    Finland: "FI",

    France: "FR",

    Gabon: "GA",

    Gambia: "GM",

    Georgia: "GE",

    Germany: "DE",

    Ghana: "GH",

    Greece: "GR",

    Grenada: "GD",

    Guatemala: "GT",

    Guinea: "GN",

    "Guinea-Bissau": "GW",

    Guyana: "GY",

    Haiti: "HT",

    Honduras: "HN",

    Hungary: "HU",

    Iceland: "IS",

    India: "IN",

    Indonesia: "ID",

    Iran: "IR",

    Iraq: "IQ",

    Ireland: "IE",

    Israel: "IL",

    Italy: "IT",

    "Ivory Coast": "CI",

    Jamaica: "JM",

    Japan: "JP",

    Jordan: "JO",

    Kazakhstan: "KZ",

    Kenya: "KE",

    "Saint Kitts and Nevis": "KN",

    Kuwait: "KW",

    Kyrgyzstan: "KG",

    Laos: "LA",

    Latvia: "LV",

    Lebanon: "LB",

    Liberia: "LR",

    Libya: "LY",

    Liechtenstein: "LI",

    Lithuania: "LT",

    Luxembourg: "LU",

    "North Macedonia": "MK",

    Madagascar: "MG",

    Malawi: "MW",

    Malaysia: "MY",

    Maldives: "MV",

    Mali: "ML",

    Malta: "MT",

    "Marshall Islands": "MH",

    Mauritania: "MR",

    Mauritius: "MU",

    Mexico: "MX",

    Micronesia: "FM",

    Moldova: "MD",

    Monaco: "MC",

    Mongolia: "MN",

    Montenegro: "ME",

    Morocco: "MA",

    Mozambique: "MZ",

    Namibia: "NA",

    Nauru: "NR",

    Nepal: "NP",

    "New Zealand": "NZ",

    Nicaragua: "NI",

    Nigeria: "NG",

    Niger: "NE",

    "North Korea": "KP",

    Norway: "NO",

    Oman: "OM",

    Pakistan: "PK",

    Palau: "PW",

    Palestine: "PS",

    Panama: "PA",

    "Papua New Guinea": "PG",

    Paraguay: "PY",

    Peru: "PE",

    Poland: "PL",

    Portugal: "PT",

    Qatar: "QA",

    Romania: "RO",

    Russia: "RU",

    Rwanda: "RW",

    "Saint Lucia": "LC",

    "El Salvador": "SV",

    Samoa: "WS",

    "San Marino": "SM",

    "Sao Tome and Principe": "ST",

    "Saudi Arabia": "SA",

    Scotland: "GB",

    Senegal: "SN",

    Serbia: "RS",

    Seychelles: "SC",

    "Sierra Leone": "SL",

    Singapore: "SG",

    Slovakia: "SK",

    Slovenia: "SI",

    "Solomon Islands": "SB",

    Somalia: "SO",

    "South Africa": "ZA",

    "South Korea": "KR",

    "South Sudan": "SS",

    Spain: "ES",

    "Sri Lanka": "LK",

    Sudan: "SD",

    Suriname: "SR",

    Eswatini: "SZ",

    Sweden: "SE",

    Switzerland: "CH",

    Syria: "SY",

    Taiwan: "TW",

    Tajikistan: "TJ",

    Tanzania: "TZ",

    Thailand: "TH",

    Togo: "TG",

    Tonga: "TO",

    "Trinidad and Tobago": "TT",

    Tunisia: "TN",

    Turkey: "TR",

    Turkmenistan: "TM",

    Tuvalu: "TV",

    Uganda: "UG",

    Ukraine: "UA",

    Uruguay: "UY",

    Uzbekistan: "UZ",

    Venezuela: "VE",

    Vietnam: "VN",

    Wales: "GB",

    Yemen: "YE",

    Zambia: "ZM",

    Zimbabwe: "ZW",
  };

  return map[country] || null;
};
