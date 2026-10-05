const TYPES = {
  geist:   { emoji: "👻", short: "Attraktion",  label: "Attraktion",                    color: "#a78bfa" },
  klingel: { emoji: "🔔", short: "Klingeln",    label: "Klingeln für Süßigkeiten",      color: "#fbbf24" },
  tuer:    { emoji: "🚪", short: "Vor der Tür", label: "Süßigkeiten vor der Haustür",   color: "#fb923c" }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const typeOf = s => TYPES[s.typ] ? s.typ : "tuer";
const pinIcon = k => L.divIcon({ className: "", iconSize: [42, 42], iconAnchor: [4, 42], popupAnchor: [17, -42],
  html: `<div class="pin" style="--c:${TYPES[k].color}"><span>${TYPES[k].emoji}</span></div>` });
const popupHtml = s => { const k = typeOf(s);
  return `<b>${esc(s.name || TYPES[k].label)}</b><br>${esc(s.addr)}<br><span class="tag" style="--c:${TYPES[k].color}">${TYPES[k].emoji} ${TYPES[k].label}</span>`; };
function newMap(id) {
  const map = L.map(id, { zoomControl: false }).setView([51.2, 10.4], 6);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { subdomains: "abcd", maxZoom: 19, attribution: "© OpenStreetMap-Mitwirkende © CARTO" }).addTo(map);
  return map;
}
const fitTo = (map, spots) => { if (spots.length) map.fitBounds(spots.map(s => [s.lat, s.lon]), { padding: [60, 60], maxZoom: 16 }); };
