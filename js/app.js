/* ============================================================
   SpeakFlow — Main Application (js/app.js)
   Bulletproof SPA view controller with defensive coding.
   ============================================================ */

const log = (...args) => {
  try { console.log("[SpeakFlow]", ...args); } catch (e) {}
};

log("Script boot starting");

import storage from "./storage.js";
import { getRandomTopic, INTEREST_LABELS, LEVEL_MAP } from "./topics.js";
import { speechEngine } from "./speech-engine.js";
import { scorer } from "./scorer.js";
import { storyCard } from "./story-card.js";
import * as ui from "./ui-controller.js";

log("All modules imported successfully");

/* ---------- safe DOM helpers ---------- */
const $(id) => document.getElementById(id);

const safeOn = (el, event, handler) => {
  if (!el) { log("WARN: safeOn null element #" + id); return; }
  el.addEventListener(event, handler);
};

/* ---------- chip group handling (defensive) ---------- */
function setupChipGroup(groupId, onChange) {
  const groupEl = $(groupId);
  if (!groupEl) { log("WARN: setupChipGroup missing #" + groupId); return; }
  const chips = groupEl.querySelectorAll(".chip");
  log("Setting up " + chips.length + " chips in #" + groupId);
  chips.forEach((chip, idx) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Remove active from all chips in this group
      groupEl.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("chip-selected", "active");
        c.setAttribute("aria-checked", "false");
      });
      // Add active to clicked chip
      chip.classList.add("chip-selected", "active");
      chip.setAttribute("aria-checked", "true");
      const val = chip.dataset.value;
      log("Chip #" + idx + " selected: " + val);
      if (onChange) onChange(val);
    });
  });
}

/* ---------- views ---------- */
function goDashboard() {
  try {
    history = storage.getHistory();
    const p = storage.getUserProfile();
    ui.updateDashboard({ ...p, streakCount: p.streakCount || 0 }, history);
    ui.showView("view-dashboard");
    log("Switched to dashboard");
  } catch (err) {
    log("goDashboard error:", err);
    ui.toast({ message: "Dashboard error", type: "error" });
  }
}

function startPractice(mode) {
  try {
    currentMode = mode;
    currentTopic = getRandomTopic(profile.interest, profile.level);
    if (!currentTopic) throw new Error("Topic not found");

    // Update UI
    if (pracTopicTitle) pracTopicTitle.textContent = currentTopic.title;
    const lvl = currentTopic.level || profile.level || "beginner";
    if (pracLevelBadge) {
      pracLevelBadge.textContent = lvl.charAt(0).toUpperCase() + lvl.slice(1);
      pracLevelBadge.dataset.level = currentTopic.level || profile.level;
    }
    if (pracInterestBadge) {
      pracInterestBadge.textContent = INTEREST_LABELS[currentTopic.interest] || currentTopic.interest;
    }

    // Render karaoke
    if (karaokeContainer) ui.prepareKaraoke(karaokeContainer, currentTopic.paragraph);
    wireWordTaps();

    // Rate controls
    if (pracPlay) pracPlay.textContent = "▶ Play Native Accent";
    currentRate = 1.0;
    if (rateBtns) rateBtns.forEach((b) => b.classList.toggle("active", b.dataset.rate === "1.0"));
    if (pracRecord) pracRecord.classList.remove("recording");
    if (recLabel) recLabel.textContent = "Record Voice";
    ui.setWaveVisible(recWave, false);
    if (recStatus) recStatus.textContent = "Press record and read the paragraph aloud.";

    finalTranscript = "";
    recognizer = null;

    ui.showView("view-practice");
    log("Switched to practice view");
  } catch (err) {
    log("startPractice error:", err);
    ui.toast({ message: "Practice start error", type: "error" });
  }
}

/* ---------- word tap wiring ---------- */
function wireWordTaps() {
  if (!karaokeContainer) return;
  document.querySelectorAll("#karaoke-paragraph .karaoke-word").forEach((span) => {
    span.onclick = (e) => {
      e.stopPropagation();
      const word = span.textContent;
      const vocab = (currentTopic.vocabulary || []).find(
        (v) => v.word.toLowerCase() === word.toLowerCase()
      );
      ui.hideTooltip();
      ui.showTooltip(span, word, vocab);
    };
    span.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        span.onclick(e);
      }
    };
  });
}

/* ---------- recording ---------- */
function startRecording() {
  try {
    if (!scorer.supported && !simulateMode) {
      if (speechFallback) speechFallback.classList.remove("hidden");
      return;
    }
    speechEngine.stop();
    recordingStartTime = Date.now();
    finalTranscript = "";

    if (simulateMode) {
      ui.setRecordingState(pracRecord, recLabel, true);
      ui.setWaveVisible(recWave, true);
      if (recStatus) recStatus.textContent = "Simulation: evaluating…";
      setTimeout(() => {
        ui.setRecordingState(pracRecord, recLabel, false);
        ui.setWaveVisible(recWave, false);
        if (recStatus) recStatus.textContent = "Simulation complete.";
        finalTranscript = currentTopic.paragraph;
      }, 1500);
      return;
    }

    recognizer = scorer.start({
      onResult: (res) => { finalTranscript = res.final || ""; },
      onEnd: () => { recognizer = null; ui.setRecordingState(pracRecord, recLabel, false); ui.setWaveVisible(recWave, false); },
      onError: (err) => { log("[scorer] error:", err); recognizer = null; ui.setRecordingState(pracRecord, recLabel, false); ui.setWaveVisible(recWave, false); let m = "Stopped."; if (err&&err.error) m = err.error+" detected."; ui.toast({message:m,type:"warn"}); if(speechFallback)speechFallback.classList.remove("hidden"); }
    });
    if (!recognizer) { ui.toast({message:"Recording failed",type:"error"}); if(speechFallback)speechFallback.classList.remove("hidden"); return; }
    ui.setRecordingState(pracRecord, recLabel, true);
    ui.setWaveVisible(recWave, true);
    if (recStatus) recStatus.textContent = "Listening…";
  } catch (err) { log("startRecording error:", err); ui.toast({message:"Recording error",type:"error"}); }
}

function stopRecording() {
  try { scorer.stop(recognizer); recognizer = null;
    ui.setRecordingState(pracRecord, recLabel, false); ui.setWaveVisible(recWave, false); }
  catch (err) { log("stopRecording error:", err); }
}

/* ---------- results ---------- */
function showResults() {
  try { stopRecording(); speechEngine.stop();
    const dur = recordingStartTime ? (Date.now()-recordingStartTime)/1000 : 0;
    const r = scorer.score(currentTopic.paragraph, finalTranscript, dur);

    if ($("res-score")) $("res-score").textContent = r.score;
    if ($("res-date")) $("res-date").textContent = new Date().toLocaleDateString();
    if ($("res-topic")) $("res-topic").textContent = currentTopic.title;
    const lvl = (profile.level || "beginner"); if ($("res-level")) $("res-level").textContent = lvl.charAt(0).toUpperCase()+lvl.slice(1);
    if ($("res-acc-pill")) $("res-acc-pill").textContent = `${r.accuracy}%`;
    if ($("res-acc-fill")) $("res-acc-fill").style.width = `${r.accuracy}%`;
    if ($("res-wpm-pill")) $("res-wpm-pill").textContent = `${r.wpm} WPM`;
    if ($("res-wpm-fill")) { $("res-wpm-fill").style.width = `${Math.min(100,(r.wpm/180)*100)}%"; $("res-wpm-fill").className = "diag-bar-fill" + (r.wpm<80||r.wpm>170?" error":""); }
    if ($("res-fill-pill")) $("res-fill-pill").textContent = `${r.fluencyScore}`;
    if ($("res-fill-fill")) $("res-fill-fill").style.width = `${Math.min(100,(r.fluencyScore/20)*100)}%`;

    const badge = r.score>=85?"🔥 Fluency Maestro":r.score>=70?"⚡ Rising Speaker":r.score>=50?"📈 Developing Speaker":"🌱 Keep Practising";
    if ($("res-badge-text")) $("res-badge-text").textContent = badge;

    const ring = $("res-score-ring"); if (ring) { const c=2*Math.PI*42; ring.style.strokeDashoffset=c-(r.score/100)*c; }
    const list = $("res-breakdown"); if (list) { list.innerHTML=""; r.wordsReview.forEach(i=>{const d=document.createElement("div"); d.className=`breakdown-item ${i.status}`; d.innerHTML=`<span class="breakdown-word">${ui.escapeHtml(i.word)}</span><span class="breakdown-tag ${i.status}">${i.status.charAt(0).toUpperCase()+i.status.slice(1)}</span>`; list.appendChild(d);});}

    storage.saveSessionScore({topic:currentTopic.title,interest:currentTopic.interest||profile.interest,level:currentTopic.level||profile.level,score:r.score,accuracy:r.accuracy,wpm:r.wpm,duration:Math.round(dur),mode:currentMode});
    storage.updateStreak(); profile=storage.getUserProfile(); history=storage.getHistory();
    ui.showView("view-results");
    log("Switched to results, score:"+r.score);
  } catch (err) { log("showResults error:",err); ui.toast({message:"Results error",type:"error"}); }
}

/* ---------- initialization ---------- */
function init() {
  try {
    log("init() start");
    // Resolve ALL DOM elements first
    const elIds = ["onboarding-form","ob-name","ob-age","ob-interest-group","ob-level-group","ob-interest","ob-level","ob-submit","ob-load",
      "dash-profile-btn","dash-start-session","prac-back","prac-play","prac-reset","prac-record","rec-label","rec-wave","rec-status","prac-done",
      "karaoke-paragraph","prac-topic-title","prac-level-badge","prac-interest-badge","res-back","res-export","res-try-again","res-next-topic",
      "story-close","story-download","speech-fallback","btn-simulate-mic","btn-dismiss-fallback",
      "res-score","res-date","res-topic","res-level","res-acc-pill","res-acc-fill","res-wpm-pill","res-wpm-fill","res-fill-pill","res-fill-fill","res-badge-text","res-breakdown","res-score-ring",
      "story-card-container","story-card","story-name","story-date","story-topic","story-badge","story-ring","story-score","story-wpm","story-accuracy","story-level",
      "toast-container","word-tooltip","tooltip-word","tooltip-urdu","tooltip-synonym","tooltip-example","tooltip-play"];
    let missing = 0;
    elIds.forEach(id=>{const e=$(id); if(!e){log("MISSING DOM:",id);missing++;}});
    log("DOM resolution done, missing:"+missing);

    profile = storage.getUserProfile();
    history = storage.getHistory();
    log("Profile: "+(profile.name||"none"));

    if (!scorer.supported && speechFallback) speechFallback.classList.remove("hidden");

    // Chip groups — with explicit logging
    const obInterestInput = $("ob-interest");
    const obLevelInput = $("ob-level");
    setupChipGroup("ob-interest-group", (val)=>{ if(obInterestInput)obInterestInput.value=val; });
    setupChipGroup("ob-level-group", (val)=>{ if(obLevelInput)obLevelInput.value=val; });

    // Restore profile into form
    if(profile&&profile.name&&$("ob-name")){ $("ob-name").value=profile.name; if($("ob-age"))$("ob-age").value=profile.age||""; if($("ob-interest"))$("ob-interest").value=profile.interest||"daily_life"; if($("ob-level"))$("ob-level").value=profile.level||"beginner"; }
    syncChipsVis($("ob-interest-group"), profile.interest||"daily_life");
    syncChipsVis($("ob-level-group"), profile.level||"beginner");

    // Onboarding submit
    safeOn($("ob-submit"),"click",(e)=>{e.preventDefault();e.stopPropagation();
      const name=$("ob-name").value.trim(), age=parseInt($("ob-age").value)||0;
      if(!name||name.length<2){ui.toast({message:"Please enter your name (2+ chars)",type:"error"});return;}
      if(!age||age<13){ui.toast({message:"Please enter a valid age",type:"error"});return;}
      if(!$("ob-interest").value||!$("ob-level").value){
        // Flash chip groups in red
        const interestGroup = $("ob-interest-group");
        const levelGroup = $("ob-level-group");
        if(interestGroup) interestGroup.classList.add("error");
        if(levelGroup) levelGroup.classList.add("error");
        setTimeout(()=>{ if(interestGroup) interestGroup.classList.remove("error"); if(levelGroup) levelGroup.classList.remove("error"); }, 1500);
        ui.toast({message:"Please select an interest and target level",type:"error"});
        return;
      }
      profile={name,age,interest:$("ob-interest").value,level:$("ob-level").value,streakCount:profile?profile.streakCount||0:0};
      storage.saveUserProfile(profile); storage.updateStreak(); profile=storage.getUserProfile();
      ui.toast({message:`Welcome, ${name}!`,type:"success"}); goDashboard();});

    // Form submit safety
    safeOn($("onboarding-form"),"submit",(e)=>{e.preventDefault();e.stopPropagation();});

    safeOn($("ob-load"),"click",()=>{if(profile&&profile.name){ui.toast({message:`Welcome back, ${profile.name}!`,type:"success"});goDashboard();}else{ui.toast({message:"No saved profile",type:"warn"});}});

    // Dashboard mode selection
    const dc=document.querySelectorAll("#view-dashboard .mode-card");
    dc.forEach(c=>safeOn(c,"click",()=>{dc.forEach(x=>x.classList.remove("selected"));c.classList.add("selected");currentMode=c.dataset.mode||"daily";log("Mode:"+currentMode);}));
    safeOn($("dash-start-session"),"click",()=>{storage.updateStreak();profile=storage.getUserProfile();startPractice(currentMode);});
    safeOn($("dash-profile-btn"),"click",()=>ui.showView("view-onboarding"));

    // Practice nav
    safeOn($("prac-back"),"click",()=>{stopRecording();speechEngine.stop();ui.showView("view-dashboard");});
    safeOn($("prac-reset"),"click",()=>{speechEngine.stop();if(pracPlay)pracPlay.textContent="▶ Play Native Accent";if(currentTopic&&karaokeContainer){ui.prepareKaraoke(karaokeContainer,currentTopic.paragraph);wireWordTaps();}});

    // Rate toggle
    const rbs=document.querySelectorAll(".rate-btn");
    rbs.forEach(b=>safeOn(b,"click",()=>{currentRate=parseFloat(b.dataset.rate);rbs.forEach(x=>x.classList.toggle("active",x===b));}));

    // Play/audio
    safeOn($("prac-play"),"click",()=>{if(!currentTopic)return;if(speechEngine.isSpeaking()){speechEngine.stop();if(pracPlay)pracPlay.textContent="▶ Play Native Accent";return;}if(pracPlay)pracPlay.textContent="⏹ Stop Audio";speechEngine.speak(karaokeContainer,currentTopic.paragraph,currentRate,()=>{},()=>{if(pracPlay)pracPlay.textContent="▶ Play Native Accent";}});

    // Record
    safeOn($("pracRecord"),"click",()=>{if(!currentTopic)return;if(recognizer&&scorer.isListening(recognizer)){stopRecording();}else{startRecording();}});

    // Done
    safeOn($("prac-done"),"click",()=>showResults());

    // Results nav
    safeOn($("resBack"),"click",()=>ui.showView("view-dashboard"));
    safeOn($("resTryAgain"),"click",()=>startPractice(currentMode));
    safeOn($("resNextTopic"),"click",()=>startPractice(currentMode));

    // Story card
    safeOn($("resExport"),"click",()=>{const s=parseInt($("res-score").textContent)||0;storyCard.render({name:profile.name||"Speaker",date:$("res-date").textContent||new Date().toLocaleDateString(),topic:$("res-topic").textContent||"-",badge:$("res-badge-text").textContent||"Rising Speaker",score:s,wpm:$("res-wpm-pill").textContent.replace(" WPM","")||"0",accuracy:$("res-acc-pill").textContent||"0%",level:$("res-level").textContent||"-"});storyCard.open();storyCard.export({score:s});});
    safeOn($("storyClose"),"click",()=>storyCard.close());
    safeOn($("storyDownload"),"click",()=>{const s=parseInt($("res-score").textContent)||0;storyCard.export({score:s});});

    // Speech fallback
    safeOn($("btn-simulate-mic"),"click",()=>{simulateMode=true;if(speechFallback)speechFallback.classList.add("hidden");ui.toast({message:"Simulation mode enabled",type:"success"});});
    safeOn($("btn-dismiss-fallback"),"click",()=>{if(speechFallback)speechFallback.classList.add("hidden");});

    // Entry point
    if(profile&&profile.name){goDashboard();}else{ui.showView("view-onboarding");}
    log("SpeakFlow initialized successfully");
  } catch (err) { log("FATAL init():"+err); ui.toast({message:"App init failed: "+err.message,type:"error"}); }
}

/* HELPER: sync chips visual state */
function syncChipsVis(groupEl, value){
  if(!groupEl)return; groupEl.querySelectorAll(".chip").forEach(c=>{const a=c.dataset.value===value; c.classList.toggle("chip-selected",a); c.classList.toggle("active",a); c.setAttribute("aria-checked",a);});
}

/* Boot */
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();