module.exports=[62294,t=>{"use strict";var e=t.i(70967);let a={USA:"#3aa0ff",Russia:"#e05a5a",China:"#f2a93c",EU:"#4dc98f",Europe:"#4dc98f",UK:"#4dc98f",Japan:"#c98fe0","South Korea":"#c98fe0",India:"#c98fe0",International:"#ffd23f",Unclassified:"#8892c0"},o={country:"Unclassified",operator:"Unknown",color:a.Unclassified},r=[{pattern:/^STARLINK/i,country:"USA",operator:"SpaceX (Starlink)"},{pattern:/^ONEWEB/i,country:"UK",operator:"OneWeb"},{pattern:/^IRIDIUM/i,country:"USA",operator:"Iridium Communications"},{pattern:/^GLOBALSTAR/i,country:"USA",operator:"Globalstar"},{pattern:/^(KUIPER|AMZN)/i,country:"USA",operator:"Amazon (Kuiper)"},{pattern:/^(FLOCK|DOVE)/i,country:"USA",operator:"Planet Labs"},{pattern:/^LEMUR/i,country:"USA",operator:"Spire Global"},{pattern:/^(GPS|NAVSTAR)/i,country:"USA",operator:"US Space Force (GPS)"},{pattern:/^USA[- ]?\d/i,country:"USA",operator:"US Government / classified"},{pattern:/^NOAA/i,country:"USA",operator:"NOAA"},{pattern:/^(TERRA|AQUA|LANDSAT)/i,country:"USA",operator:"NASA / USGS"},{pattern:/^COSMOS/i,country:"Russia",operator:"Roscosmos / MoD"},{pattern:/^GLONASS/i,country:"Russia",operator:"Roscosmos (GLONASS)"},{pattern:/^METEOR/i,country:"Russia",operator:"Roscosmos (Meteor)"},{pattern:/^RESURS/i,country:"Russia",operator:"Roscosmos (Resurs)"},{pattern:/^BEIDOU/i,country:"China",operator:"CNSA (BeiDou)"},{pattern:/^YAOGAN/i,country:"China",operator:"PLA / CNSA (Yaogan)"},{pattern:/^GAOFEN/i,country:"China",operator:"CNSA (Gaofen)"},{pattern:/^(TIANGONG|SHENZHOU|TIANZHOU)/i,country:"China",operator:"CNSA (crewed program)"},{pattern:/^CZ[- ]?\d/i,country:"China",operator:"CNSA (Long March rocket body)"},{pattern:/^GALILEO/i,country:"EU",operator:"European Union (Galileo)"},{pattern:/^SENTINEL/i,country:"EU",operator:"ESA (Copernicus/Sentinel)"},{pattern:/^METOP/i,country:"Europe",operator:"EUMETSAT (MetOp)"},{pattern:/^(SES|ASTRA|EUTELSAT)/i,country:"Europe",operator:"Commercial (SES/Eutelsat)"},{pattern:/^(HIMAWARI|QZS)/i,country:"Japan",operator:"JAXA"},{pattern:/^KOMPSAT/i,country:"South Korea",operator:"KARI"},{pattern:/^(CARTOSAT|RISAT|IRNSS)/i,country:"India",operator:"ISRO"},{pattern:/^ISS/i,country:"International",operator:"NASA / Roscosmos / partners (ISS)"},{pattern:/^INTELSAT/i,country:"International",operator:"Intelsat"}],n=/^(ISS|TIANGONG|MIR|SALYUT)/i,i=/^(GPS|NAVSTAR|GLONASS|GALILEO|BEIDOU|QZS|IRNSS|NAVIC)/i;async function E(){await e.f`
    CREATE TABLE IF NOT EXISTS satellites (
      norad_id     INTEGER PRIMARY KEY,
      name         TEXT NOT NULL,
      last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `,await e.f`ALTER TABLE satellites ADD COLUMN IF NOT EXISTS operator_name TEXT;`,await e.f`ALTER TABLE satellites ADD COLUMN IF NOT EXISTS operator_country TEXT;`,await e.f`ALTER TABLE satellites ADD COLUMN IF NOT EXISTS object_type TEXT;`,await e.f`
    CREATE TABLE IF NOT EXISTS overflight_events (
      id            BIGSERIAL PRIMARY KEY,
      norad_id      INTEGER REFERENCES satellites(norad_id),
      observed_at   TIMESTAMPTZ NOT NULL,
      lat           NUMERIC NOT NULL,
      lon           NUMERIC NOT NULL,
      alt_km        NUMERIC,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `,await e.f`
    CREATE INDEX IF NOT EXISTS idx_overflight_time ON overflight_events (observed_at);
  `,await e.f`
    CREATE TABLE IF NOT EXISTS petition_signatures (
      id          BIGSERIAL PRIMARY KEY,
      name        TEXT,
      country     TEXT,
      comment     TEXT,
      email       TEXT,
      contact_consent BOOLEAN NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `,await e.f`ALTER TABLE petition_signatures ADD COLUMN IF NOT EXISTS email TEXT;`,await e.f`ALTER TABLE petition_signatures ADD COLUMN IF NOT EXISTS contact_consent BOOLEAN NOT NULL DEFAULT false;`}async function S(t,E,T=null){let{operator:s,country:p}=function(t){for(let e of r)if(e.pattern.test(t))return{country:e.country,operator:e.operator,color:a[e.country]??a.Unclassified};return o}(E),{type:A}=n.test(E)?{type:"Space Station",shape:"diamond"}:i.test(E)?{type:"Navigation (GNSS)",shape:"square"}:null==T?{type:"Other",shape:"circle"}:T<2e3?{type:"LEO",shape:"circle"}:T<35e3?{type:"MEO",shape:"circle"}:{type:"GEO",shape:"circle"};await e.f`
    INSERT INTO satellites (norad_id, name, operator_name, operator_country, object_type, last_updated)
    VALUES (${t}, ${E}, ${s}, ${p}, ${A}, now())
    ON CONFLICT (norad_id) DO UPDATE SET
      name = EXCLUDED.name,
      operator_name = EXCLUDED.operator_name,
      operator_country = EXCLUDED.operator_country,
      object_type = EXCLUDED.object_type,
      last_updated = now();
  `}async function T(t){let{noradId:a,lat:o,lon:r,altKm:n,observedAt:i}=t;await e.f`
    INSERT INTO overflight_events (norad_id, observed_at, lat, lon, alt_km)
    VALUES (${a}, ${i.toISOString()}, ${o}, ${r}, ${n});
  `}async function s(){let{rows:t}=await e.f`SELECT COUNT(*)::int AS count FROM overflight_events;`;return t[0]?.count??0}async function p(){let{rows:t}=await e.f`SELECT MIN(observed_at) AS first FROM overflight_events;`;return t[0]?.first?new Date(t[0].first):null}async function A(t=50){let{rows:a}=await e.f`
    SELECT e.observed_at, e.lat, e.lon, e.alt_km, s.name, s.norad_id,
           s.operator_name, s.operator_country, s.object_type
    FROM overflight_events e
    JOIN satellites s ON s.norad_id = e.norad_id
    ORDER BY e.observed_at DESC
    LIMIT ${t};
  `;return a}t.s(["J",0,s,"T",0,E,"O",0,p,"r",0,T,"P",0,A,"z",0,S],62294)}];

//# sourceMappingURL=lib_db_ts_1ttuckbd3em8v._.js.map