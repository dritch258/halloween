// Optional: kostenloser CARTO-Key von carto.com/basemaps/apikey. Leer lassen = OpenStreetMap-Kacheln (kein Key nötig).
const CARTO_KEY = "";
const TYPES = {
  geist:   { emoji: "👻", short: "Attraktion",  label: "Attraktion",                    color: "#a78bfa" },
  klingel: { emoji: "🔔", short: "Klingeln",    label: "Klingeln für Süßigkeiten",      color: "#fbbf24" },
  tuer:    { emoji: "🚪", short: "Vor der Tür", label: "Süßigkeiten vor der Haustür",   color: "#fb923c" }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Kürzt Adressen auf "Straße Hausnummer" (auch ältere, lange Einträge aus der JSON)
const shortAddr = a => { const p = String(a || "").split(", ");
  for (let i = 0; i < p.length - 1; i++) if (/^\d+[a-z]?([-–\/]\d+[a-z]?)?$/i.test(p[i])) return p[i + 1] + " " + p[i];
  return p[0]; };
// Nominatim-Ergebnis (mit addressdetails) -> "Straße Hausnummer"
const addrOf = r => { const a = r.address || {};
  const road = a.road || a.pedestrian || a.footway || a.path || a.cycleway || a.residential || a.square || "";
  return road ? road + (a.house_number ? " " + a.house_number : "") : shortAddr(r.display_name); };
const typeOf = s => TYPES[s.typ] ? s.typ : "tuer";
const pinIcon = k => L.divIcon({ className: "", iconSize: [42, 42], iconAnchor: [4, 42], popupAnchor: [17, -42],
  html: `<div class="pin" style="--c:${TYPES[k].color}"><span>${TYPES[k].emoji}</span></div>` });
const popupHtml = s => { const k = typeOf(s);
  return `${s.name ? `<b>${esc(s.name)}</b><br>` : ""}${esc(shortAddr(s.addr))}<br><span class="tag" style="--c:${TYPES[k].color}">${TYPES[k].emoji} ${TYPES[k].label}</span>`; };
function newMap(id) {
  const map = L.map(id, { zoomControl: false }).setView([51.2, 10.4], 6);
  L.control.zoom({ position: "topright" }).addTo(map);
  if (CARTO_KEY) {
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_KEY}`, { subdomains: "abcd", maxZoom: 19,
      attribution: "© OpenStreetMap-Mitwirkende © CARTO" }).addTo(map);
  } else {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: "dark-tiles",
      attribution: "© OpenStreetMap-Mitwirkende" }).addTo(map);
  }
  return map;
}
const fitTo = (map, spots) => { if (spots.length) map.fitBounds(spots.map(s => [s.lat, s.lon]), { padding: [60, 60], maxZoom: 16 }); };
