/* Calculo hub — total visitors across all Knovay labs.
   Read-only. Sums three live counts, exactly like the Knovay homepage:
     GeoProof  → geoproof-a2db0  stats/site.visitors
     Physica   → physica-69f62   stats/site.visits
     Calculo   → geoproof-a2db0  stats/site.calculoVisits
   Paints #totalVisits. Uses the same 'kv:*' cache keys as knovay.com for an
   instant paint on repeat visits. Calculo's own count (#calcVisits) is handled
   separately by calculo-visits.js. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

var GEO = { apiKey:"AIzaSyB2YooHATeNcu_3lYzL7vOjTwpDDlP6I1U", authDomain:"geoproof-a2db0.firebaseapp.com",
  projectId:"geoproof-a2db0", storageBucket:"geoproof-a2db0.firebasestorage.app",
  messagingSenderId:"504119803431", appId:"1:504119803431:web:87f82a578f16367801d802" };
var PHYS = { apiKey:"AIzaSyDqdhi8AAnjNyOR0sWkdr5_fC1_wmy4F-o", authDomain:"physica-69f62.firebaseapp.com",
  projectId:"physica-69f62", storageBucket:"physica-69f62.firebasestorage.app",
  messagingSenderId:"335856818743", appId:"1:335856818743:web:6979546a0e3cbb60aabdb2" };

var geoDb, physDb;
try {
  geoDb  = getFirestore(initializeApp(GEO,  "geoTot"));
  physDb = getFirestore(initializeApp(PHYS, "physTot"));
} catch (e) { /* firebase unavailable — leave placeholder */ }

var latest = { geo:null, phys:null, calc:null };
function paintTotal(){
  if (latest.geo === null && latest.phys === null && latest.calc === null) return;
  var t = Number((latest.geo || 0) + (latest.phys || 0) + (latest.calc || 0)).toLocaleString();
  ["totalVisits", "heroTotal"].forEach(function(id){ var el = document.getElementById(id); if (el) el.textContent = t; });
}
function live(db, field, key){
  try {
    onSnapshot(doc(db, "stats", "site"), function(snap){
      var n = (snap.exists() && typeof snap.data()[field] === "number") ? snap.data()[field] : 0;
      latest[key] = n;
      try { localStorage.setItem("kv:" + key, String(n)); } catch (e) {}
      paintTotal();
    }, function(){ /* read failed — leave placeholder */ });
  } catch (e) {}
}

// instant paint from the last known values (shared with knovay.com)
(function(){
  try {
    var cg = parseInt(localStorage.getItem("kv:geo")  || "", 10);
    var cp = parseInt(localStorage.getItem("kv:phys") || "", 10);
    var cc = parseInt(localStorage.getItem("kv:calc") || "", 10);
    if (!isNaN(cg)) latest.geo  = cg;
    if (!isNaN(cp)) latest.phys = cp;
    if (!isNaN(cc)) latest.calc = cc;
    paintTotal();
  } catch (e) {}
})();

if (geoDb && physDb) {
  live(geoDb,  "visitors",      "geo");
  live(physDb, "visits",        "phys");
  live(geoDb,  "calculoVisits", "calc");
}
