/* Calculo — account + favorites sync.
   Reuses the geoproof-a2db0 Firebase project (same account as GeoProof/Physica).
   Calculo's saved labs live in users/{uid}.calculoFavs — a namespaced field, so this
   never touches any other product's data. Favorites still work fully offline via
   localStorage ('calculo:favs'); signing in merges the local list with the cloud one
   and keeps them in sync across devices.

   Events (window):
     'calculo:auth'        detail {user}   — auth state changed (user or null)
     'calculo:favschanged'                 — local favorites changed; push to cloud
     'calculo:favssynced'                  — favorites updated from cloud; re-render UI
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const CFG = {
  apiKey: "AIzaSyB2YooHATeNcu_3lYzL7vOjTwpDDlP6I1U",
  authDomain: "geoproof-a2db0.firebaseapp.com",
  projectId: "geoproof-a2db0",
  storageBucket: "geoproof-a2db0.firebasestorage.app",
  messagingSenderId: "504119803431",
  appId: "1:504119803431:web:87f82a578f16367801d802"
};

let auth, db;
try {
  const app = initializeApp(CFG, "calculoAuth");   // shared name => shared session across pages
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (e) { /* firebase unavailable — favorites still work locally */ }

function readFavs(){ try { return JSON.parse(localStorage.getItem("calculo:favs") || "[]"); } catch (e) { return []; } }
function writeFavs(a){ try { localStorage.setItem("calculo:favs", JSON.stringify(a)); } catch (e) {} }
function mergeFavs(a, b){
  const seen = {}, out = [];
  a.concat(b).forEach(function(x){ if (x && x.f && !seen[x.f]){ seen[x.f] = 1; out.push({ f:x.f, t:x.t }); } });
  return out;
}
function emitAuth(user){ try { window.calculoUser = user; window.dispatchEvent(new CustomEvent("calculo:auth", { detail:{ user:user } })); } catch (e) {} }
function emitSynced(){ try { window.dispatchEvent(new CustomEvent("calculo:favssynced")); } catch (e) {} }

let currentUid = null, unsub = null, lastSynced = "";

if (auth) {
  onAuthStateChanged(auth, function(user){
    if (unsub){ unsub(); unsub = null; }
    if (user) {
      currentUid = user.uid;
      const uref = doc(db, "users", user.uid);
      // one-time merge of local + cloud on sign-in
      getDoc(uref).then(function(snap){
        const remote = (snap.exists() && Array.isArray(snap.data().calculoFavs)) ? snap.data().calculoFavs : [];
        const merged = mergeFavs(readFavs(), remote);
        writeFavs(merged);
        lastSynced = JSON.stringify(merged);
        setDoc(uref, { calculoFavs: merged, calculoEmail: user.email || null, calculoUpdated: Date.now() }, { merge:true }).catch(function(){});
        emitSynced();
        // live updates from other devices
        unsub = onSnapshot(uref, function(s){
          const rf  = (s.exists() && Array.isArray(s.data().calculoFavs)) ? s.data().calculoFavs : [];
          const rfs = JSON.stringify(rf);
          if (rfs !== JSON.stringify(readFavs())) { writeFavs(rf); lastSynced = rfs; emitSynced(); }
        }, function(){});
      }).catch(function(){ /* rules/permission — favorites still work locally */ });
      emitAuth(user);
    } else {
      currentUid = null; emitAuth(null);
    }
  });

  // push local changes up when signed in
  window.addEventListener("calculo:favschanged", function(){
    if (!currentUid) return;
    const cur = readFavs(), s = JSON.stringify(cur);
    if (s === lastSynced) return;
    lastSynced = s;
    setDoc(doc(db, "users", currentUid), { calculoFavs: cur, calculoUpdated: Date.now() }, { merge:true }).catch(function(){});
  });
}

// exposed for the sign-out control in the switcher menu
window.calculoSignOut = function(){ try { if (auth) signOut(auth); } catch (e) {} };
