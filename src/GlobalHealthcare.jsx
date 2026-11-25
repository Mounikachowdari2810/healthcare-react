
import React, { useState, useEffect } from "react";

export default function GlobalHealthcare() {

   const [countries, setCountries] = useState(() => {
    const names = new Intl.DisplayNames(["en"], {
      type: "region",
      fallback: "none"
    });

    const codes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW";

    return codes.split(" ").map(code => ({
      cca2: code,
      name: { common: names.of(code) || code },
      flag: String.fromCodePoint(
        ...[...code].map(c => c.charCodeAt(0) + 127397)
      )
    })).sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );
  }); const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  async function searchHealthcare() {
    if (!country || !city.trim()) {
      setMessage("Please select a country and enter a city.");
      return;
    }

    setLoading(true);
    setResults([]);
    setMessage("");

    try {
      const location = await fetch(
        "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({
          city: city.trim(),
          countrycodes: country.toLowerCase(),
          format: "json",
          limit: "1"
        })
      );

      if (!location.ok) throw new Error();

      const places = await location.json();

      if (!places.length) {
        setMessage("City not found.");
        return;
      }

      const { lat, lon } = places[0];

      const query = `
        [out:json][timeout:30];
        (
          nwr["amenity"~"^(hospital|clinic|doctors)$"]
          (around:15000,${lat},${lon});

          nwr["healthcare"~"^(hospital|clinic|doctor)$"]
          (around:15000,${lat},${lon});
        );
        out center 50;
      `;

      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: new URLSearchParams({ data: query })
        }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      const healthcare = data.elements.filter(
        item => item.tags?.name
      );

      setResults(healthcare);

      if (!healthcare.length) {
        setMessage("No healthcare providers found.");
      }

    } catch {
      setMessage(
        "Unable to retrieve healthcare data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="consultation-section"
      style={{ padding: "30px" }}
    >
      <h2>🌍 Global Healthcare</h2>

      <p>
        Explore hospitals, clinics and healthcare
        providers across the world.
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "15px",
        margin: "25px 0"
      }}>

        <select
          value={country}
          disabled={loading}
          onChange={e => {
            setCountry(e.target.value);
            setCity("");
            setResults([]);
            setMessage("");
          }}
          style={{
            padding: "12px",
            borderRadius: "8px",
            minWidth: "200px"
          }}
        >
          <option value="">Select Country</option>

          {countries.map(c => (
            <option key={c.cca2} value={c.cca2}>
              {c.flag} {c.name.common}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter City Name"
          value={city}
          disabled={loading}
          onChange={e => setCity(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px"
          }}
        />

        <button
          className="consult-btn"
          onClick={searchHealthcare}
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Search Healthcare"}
        </button>

      </div>

      {message && <p>{message}</p>}

      {results.length > 0 && (
        <h3>
          {results.length} Healthcare Providers Found
        </h3>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "20px"
      }}>

        {results.map(item => {
          const tags = item.tags;

          const lat = item.lat ?? item.center?.lat;
          const lon = item.lon ?? item.center?.lon;

          return (
            <div
              key={`${item.type}-${item.id}`}
              style={{
                background: "#ffffff",
                color: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 3px 12px #00000015",
                textAlign: "left"
              }}
            >
              <h3 style={{ color: "#2563eb" }}>
                🏥 {tags.name}
              </h3>

              <p>
                <strong>Type:</strong>{" "}
                {tags.healthcare ||
                  tags.amenity ||
                  "Healthcare Provider"}
              </p>

              <p>
                <strong>Specialization:</strong>{" "}
                {tags["healthcare:speciality"] ||
                  "Not listed"}
              </p>

              <p>
                <strong>City:</strong> {city}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {tags.phone ||
                  tags["contact:phone"] ||
                  "Not listed"}
              </p>

              {lat != null && lon != null && (
                <a
                  href={
                    `https://www.openstreetmap.org/` +
                    `?mlat=${lat}&mlon=${lon}` +
                    `#map=17/${lat}/${lon}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#2563eb",
                    fontWeight: "bold"
                  }}
                >
                  📍 View Location
                </a>
              )}
            {(tags.phone || tags["contact:phone"]) && (
  <p>
    <a
      href={`tel:${tags.phone || tags["contact:phone"]}`}
      style={{
        color: "#087f8c",
        fontWeight: "bold"
      }}
    >
      📞 Contact Hospital
    </a>
  </p>
)}

{/^https?:\/\//i.test(
  tags.website || tags["contact:website"] || ""
) && (
  <p>
    <a
      href={tags.website || tags["contact:website"]}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2563eb",
        fontWeight: "bold"
      }}
    >
      🌐 Visit Hospital Website
    </a>
  </p>
)}</div>
          );
        })}

      </div>

      <p style={{
        marginTop: "25px",
        fontSize: "12px"
      }}>
        Country data: REST Countries.
        Healthcare data: © OpenStreetMap contributors.
        Information may be incomplete or outdated.
      </p>

    </section>
  );
}
