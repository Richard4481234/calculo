/* Calculo — unique-visitor counter.
   Counts each browser once (localStorage guard) and shows the running total live.
   Reuses the geoproof-a2db0 Firestore project (public web config) and stores Calculo's
   own tally in a separate field, stats/site.calculoVisits, so it never touches GeoProof's
   count. The Knovay homepage reads this same field to display Calculo's visits. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, increment }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

var CFG = {
  apiKey: "AIzaSyB2YooHATeNcu_3lYzL7vOjTwpDDlP6I1U",
  authDomain: "geoproof-a2db0.firebaseapp.com",
  projectId: "geoproof-a2db0",
  storageBucket: "geoproof-a2db0.firebasestorage.app",
  messagingSenderId: "504119803431",
  appId: "1:504119803431:web:87f82a578f16367801d802"
};

var db, ref;
try {
  db  = getFirestore(initializeApp(CFG, "calculo"));
  ref = doc(db, "stats", "site");
} catch (e) { /* firebase unavailable — page still works, just no counter */ }

function paint(n){
  var el = document.getElementById("calcVisits");
  if (el) el.textContent = Number(n).toLocaleString();
}

// Instant paint from the last known value so the number never flashes "…".
try {
  var cached = parseInt(localStorage.getItem("calculo:vc") || "", 10);
  if (!isNaN(cached)) paint(cached);
} catch (e) {}

if (ref) {
  // Count this browser once, ever.
  try {
    var firstTime = !localStorage.getItem("calculo:visited");
    if (firstTime) {
      setDoc(ref, { calculoVisits: increment(1) }, { merge: true })
        .then(function(){ try { localStorage.setItem("calculo:visited", "1"); } catch (e) {} })
        .catch(function(){});
    }
  } catch (e) {}

  // Live total — updates the footer count whenever it changes.
  try {
    onSnapshot(ref, function(snap){
      var n = (snap.exists() && typeof snap.data().calculoVisits === "number") ? snap.data().calculoVisits : 0;
      try { localStorage.setItem("calculo:vc", String(n)); } catch (e) {}
      paint(n);
    }, function(){ /* read failed — leave the cached value */ });
  } catch (e) {}
}
