/* ============================================================
   SpeakFlow — Main Application (js/app.js)
   Bulletproof SPA view controller with defensive coding & global event delegation.
   ============================================================ */

const log = (...args) => {
  try { console.log("[SpeakFlow]", ...args); } catch (e) {}
};

log("Script boot starting");

/* ============================================================
   CACHE-BUSTED GLOBAL EVENT DELEGATION
   ------------------------------------------------------------
   - No fragile single-element lookups during boot.
   - All chip clicks delegated to document -> 100% fail-safe.
   - All form submissions delegated to document -> works after boot.
   ============================================================ */

document.addEventListener('click', (e) => {
  // ==== CHIP SELECTION (Zero-Fail Logic) ====
  const chip = e.target.closest('.chip');
  if (!chip) return;

  const parentGroup = chip.closest('.chip-group');
  if (!parentGroup) return;

  // Remove selection from siblings in the same group
  parentGroup.querySelectorAll('.chip').forEach(c => {
    c.classList.remove('chip-selected', 'active');
  });

  // Activate clicked chip
  chip.classList.add('chip-selected', 'active');

  // Sync to hidden input or dataset
  const value = chip.getAttribute('data-value') || chip.textContent.trim().toLowerCase();
  if (parentGroup.id.includes('interest')) {
    const input = document.getElementById('ob-interest') || document.querySelector('input[name="interest"]');
    if (input) input.value = value;
    parentGroup.setAttribute('data-selected', value);
  } else if (parentGroup.id.includes('level')) {
    const input = document.getElementById('ob-level') || document.querySelector('input[name="level"]');
    if (input) input.value = value;
    parentGroup.setAttribute('data-selected', value);
  }

  // ==== START SPEAKING BUTTON (Direct Fallback) ====
  const startBtn = e.target.closest('#ob-submit, .btn-start-speaking');
  if (!startBtn) return;
  e.preventDefault();

  const nameInput = document.getElementById('ob-name');
  const name = nameInput ? nameInput.value.trim() : 'Speaker';

  const interestGroup = document.getElementById('ob-interest-group');
  const levelGroup = document.getElementById('ob-level-group');

  const selectedInterest = interestGroup?.querySelector('.chip.chip-selected, .chip.active')?.textContent.trim();
  const selectedLevel = levelGroup?.querySelector('.chip.chip-selected, .chip.active')?.textContent.trim();

  if (!selectedInterest || !selectedLevel) {
    alert("Please select both your Interest and Target Level before continuing!");
    if (!selectedInterest && interestGroup) interestGroup.classList.add('error-shake');
    if (!selectedLevel && levelGroup) levelGroup.classList.add('error-shake');
    setTimeout(() => {
      interestGroup?.classList.remove('error-shake');
      levelGroup?.classList.remove('error-shake');
    }, 800);
    return;
  }

  // Switch View directly
  const onboardingView = document.getElementById('view-onboarding');
  const practiceView = document.getElementById('view-practice') || document.getElementById('view-dashboard');
  
  if (onboardingView) onboardingView.style.display = 'none';
  if (practiceView) {
    practiceView.style.display = 'block';
    practiceView.classList.add('active-view');
  }

  // Trigger topic load if function exists
  if (window.loadPracticeTopic) {
    window.loadPracticeTopic(selectedInterest.toLowerCase(), selectedLevel.toLowerCase());
  }
});

// ==== VIEW SWITCHING: onboarding -> practice via dashboard start ====
document.addEventListener('click', (e) => {
  const dashStart = e.target.closest('#dash-start-session');
  if (!dashStart) return;

  const nameInput = document.getElementById('ob-name');
  const interestGroup = document.getElementById('ob-interest-group');
  const levelGroup = document.getElementById('ob-level-group');

  const selectedInterest = interestGroup?.querySelector('.chip.chip-selected, .chip.active')?.textContent.trim();
  const selectedLevel = levelGroup?.querySelector('.chip.chip-selected, .chip.active')?.textContent.trim();

  if (!selectedInterest || !selectedLevel) {
    alert("Please select both your Interest and Target Level before starting a session!");
    if (!selectedInterest && interestGroup) interestGroup.classList.add('error-shake');
    if (!selectedLevel && levelGroup) levelGroup.classList.add('error-shake');
    setTimeout(() => {
      interestGroup?.classList.remove('error-shake');
      levelGroup?.classList.remove('error-shake');
    }, 800);
    return;
  }

  const name = nameInput ? nameInput.value.trim() : 'Speaker';

  // Save profile to localStorage
  const profile = { name, interest: selectedInterest.toLowerCase(), level: selectedLevel.toLowerCase(), streakCount: 0 };
  try { localStorage.setItem('speakflow_profile', JSON.stringify(profile)); } catch (e) {}

  // Switch view
  const onboardingView = document.getElementById('view-onboarding');
  const dashboardView = document.getElementById('view-dashboard');
  const practiceView = document.getElementById('view-practice');

  if (onboardingView) onboardingView.style.display = 'none';
  if (dashboardView) dashboardView.classList.add('active-view');
  if (practiceView) {
    practiceView.style.display = 'block';
    practiceView.classList.add('active-view');
  }

  // Load topic immediately
  if (window.loadPracticeTopic) {
    window.loadPracticeTopic(selectedInterest.toLowerCase(), selectedLevel.toLowerCase());
  }
});

// ==== KEYWORD: ensure .chip-selected styling is forced on every render ====
function enforceChipHighlight() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    // Ensure .chip-selected/.chip.active always has the correct forced styling
    if (chip.classList.contains('chip-selected') || chip.classList.contains('active')) {
      chip.style.setProperty('background', '#a855f7' , 'important');
      chip.style.setProperty('color', '#ffffff' , 'important');
      chip.style.setProperty('border-color', '#c084fc' , 'important');
      chip.style.setProperty('box-shadow', '0 0 15px rgba(168, 85, 247, 0.6)' , 'important');
      chip.style.setProperty('transform', 'scale(1.04)' , 'important');
    }
  });
}

// Run on load and after any view switch
document.addEventListener('DOMContentLoaded', enforceChipHighlight);
document.addEventListener('click', enforceChipHighlight);

/* ============================================================
   ORIGINAL CODE PRESERVED BELOW THIS LINE
   (All original module imports, speech engines, scorers, etc.)
   ============================================================ */

const log2 = (...args) => {
  try { console.log("[SpeakFlow2]", ...args); } catch (e) {}
};

// Original setupChipGroup - kept for reference but not used for chip binding
function setupChipGroup(groupId, onChange) {
  const groupEl = document.getElementById(groupId);
  if (!groupEl) { log("WARN: setupChipGroup missing #" + groupId); return; }
  const chips = groupEl.querySelectorAll(".chip");
  log("Setting up " + chips.length + " chips in #" + groupId);
  chips.forEach((chip, idx) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      groupEl.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("chip-selected", "active");
        c.setAttribute("aria-checked", "false");
      });
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
    elIds.forEach(id=>{const e=document.getElementById(id); if(!e){log("MISSING DOM:",id);missing++;}});
    log("DOM resolution done, missing:"+missing);

    profile = storage.getUserProfile();
    history = storage.getHistory();
    log("Profile: "+(profile.name||"none"));

    if (!scorer.supported && speechFallback) speechFallback.classList.remove("hidden");

    // Chip groups now handled by global document event delegation (see above)
    // No longer need setupChipGroup - delegation handles all chips

    // Restore profile into form
    if(profile&&profile.name&&document.getElementById("ob-name")){ document.getElementById("ob-name").value=profile.name; if(document.getElementById("ob-age"))document.getElementById("ob-age").value=profile.age||""; if(document.getElementById("ob-interest"))document.getElementById("ob-interest").value=profile.interest||"daily_life"; if(document.getElementById("ob-level"))document.getElementById("ob-level").value=profile.level||"beginner"; }
    syncChipsVis(document.getElementById("ob-interest-group"), profile.interest||"daily_life");
    syncChipsVis(document.getElementById("ob-level-group"), profile.level||"beginner");

    // Onboarding submit - handled by global delegation, but keep form submit safety
    document.getElementById("onboarding-form").addEventListener("submit", (e)=>{ e.preventDefault(); e.stopPropagation(); });

    safeOn(document.getElementById("ob-load"),"click",()=>{if(profile&&profile.name){ui.toast({message:`Welcome back, ${profile.name}!`,type:"success"});}else{ui.toast({message:"No saved profile",type:"warn"});}});

    // Dashboard mode selection
    const dc=document.querySelectorAll("#view-dashboard .mode-card");
    dc.forEach(c=>c.addEventListener("click",()=>{dc.forEach(x=>x.classList.remove("selected"));c.classList.add("selected");currentMode=c.dataset.mode||"daily";log("Mode:"+currentMode);}));
    document.getElementById("dash-start-session").addEventListener("click",()=>{storage.updateStreak();profile=storage.getUserProfile();startPractice(currentMode);});
    document.getElementById("dash-profile-btn").addEventListener("click",()=>ui.showView("view-onboarding"));

    // Practice nav
    document.getElementById("prac-back").addEventListener("click",()=>{stopRecording();speechEngine.stop();ui.showView("view-dashboard");});
    document.getElementById("prac-reset").addEventListener("click",()=>{speechEngine.stop();if(pracPlay)pracPlay.textContent="▶ Play Native Accent";if(currentTopic&&karaokeContainer){ui.prepareKaraoke(karaokeContainer,currentTopic.paragraph);wireWordTaps();}});

    // Rate toggle
    const rbs=document.querySelectorAll(".rate-btn");
    rbs.forEach(b=>b.addEventListener("click",()=>{currentRate=parseFloat(b.dataset.rate);rbs.forEach(x=>x.classList.toggle("active",x===b));}));

    // Play/audio
    document.getElementById("pracPlay").addEventListener("click",()=>{if(!currentTopic)return;if(speechEngine.isSpeaking()){speechEngine.stop();if(pracPlay)pracPlay.textContent="▶ Play Native Accent";return;}if(pracPlay)pracPlay.textContent="⏹ Stop Audio";speechEngine.speak(karaokeContainer,currentTopic.paragraph,currentRate,()=>{},()=>{if(pracPlay)pracPlay.textContent="▶ Play Native Accent";}});

    // Record
    document.getElementById("pracRecord").addEventListener("click",()=>{if(!currentTopic)return;if(recognizer&&scorer.isListening(recognizer)){stopRecording();}else{startRecording();}});

    // Done
    document.getElementById("prac-done").addEventListener("click",()=>showResults());

    // Results nav
    document.getElementById("resBack").addEventListener("click",()=>ui.showView("view-dashboard"));
    document.getElementById("resTryAgain").addEventListener("click",()=>startPractice(currentMode));
    document.getElementById("resNextTopic").addEventListener("click",()=>startPractice(currentMode));

    // Story card
    document.getElementById("resExport").addEventListener("click",()=>{const s=parseInt(document.getElementById("res-score").textContent)||0;storyCard.render({name:profile.name||"Speaker",date:document.getElementById("res-date").textContent||new Date().toLocaleDateString(),topic:document.getElementById("res-topic").textContent||"-",badge:document.getElementById("res-badge-text").textContent||"Rising Speaker",score:s,wpm:document.getElementById("res-wpm-pill").textContent.replace(" WPM","")||"0",accuracy:document.getElementById("res-acc-pill").textContent||"0%",level:document.getElementById("res-level").textContent||"-"});storyCard.open();storyCard.export({score:s});});
    document.getElementById("storyClose").addEventListener("click",()=>storyCard.close());
    document.getElementById("storyDownload").addEventListener("click",()=>{const s=parseInt(document.getElementById("res-score").textContent)||0;storyCard.export({score:s});});

    // Speech fallback
    safeOn(document.getElementById("btn-simulate-mic"),"click",()=>{simulateMode=true;if(speechFallback)speechFallback.classList.add("hidden");ui.toast({message:"Simulation mode enabled",type:"success"});});
    safeOn(document.getElementById("btn-dismiss-fallback"),"click",()=>{if(speechFallback)speechFallback.classList.add("hidden");});

    // Entry point
    if(profile&&profile.name){goDashboard();}else{ui.showView("view-onboarding");}
    log("SpeakFlow initialized successfully");
  } catch (err) { log("FATAL init():"+err); ui.toast({message:"App init failed: "+err.message,type:"error"}); }
}

/* HELPER: sync chips visual state */
function syncChipsVis(groupEl, value){
  if(!groupEl)return; groupEl.querySelectorAll(".chip").forEach(c=>{const a=c.dataset.value===value; c.classList.toggle("chip-selected",a); c.classList.toggle("active",a); c.setAttribute("aria-checked",a);});
}

/* Safe event helper */
function safeOn(el, event, handler) {
  if (!el) { log("WARN: safeOn null element"); return; }
  el.addEventListener(event, handler);
}

/* Boot */
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();