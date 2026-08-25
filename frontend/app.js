/**
 * GitProof - Frontend Logic & GenLayer Consensus Simulator
 * Enhanced with Motion / Framer Motion Animations, Tailwind UI,
 * and Full GitHub Profile Viewer for searched accounts.
 */

// Simulated on-chain state storage (mirrors GenLayer Intelligent Contract storage)
const contractState = {
  claims: {},
  userClaims: {},
  userBadges: {
    "torvalds": ["CONTRIB_TIER_500", "CONTRIBUTOR_LINUX", "CORE_MAINTAINER"],
    "vbuterin": ["CONTRIB_TIER_300", "CONTRIBUTOR_ETHEREUM_GO_ETHEREUM", "EIP_AUTHOR"],
    "karalabe": ["CONTRIB_TIER_500", "CONTRIBUTOR_ETHEREUM_GO_ETHEREUM", "GETH_LEAD"]
  }
};

// Known demo profile data cache for instant rich simulation
const demoProfileData = {
  "torvalds": {
    name: "Linus Torvalds",
    username: "torvalds",
    avatar: "https://avatars.githubusercontent.com/u/1024025?v=4",
    annualContribs: 3420,
    publicRepos: 7,
    followers: 245000,
    following: 0,
    company: "Linux Foundation",
    location: "Portland, OR",
    blog: "https://kernel.org",
    bio: "Creator of Linux and Git. Open source architect.",
    verifiedRepos: ["torvalds/linux", "git/git"],
    repos: [
      { name: "linux", description: "Linux kernel source tree", language: "C", stars: 178000, forks: 54000, url: "https://github.com/torvalds/linux" },
      { name: "git", description: "Fast, scalable, distributed revision control system", language: "C", stars: 52000, forks: 26000, url: "https://github.com/git/git" },
      { name: "subsurface-for-dirk", description: "Subsurface dive log program", language: "C", stars: 1200, forks: 450, url: "https://github.com/torvalds/subsurface-for-dirk" },
      { name: "uemacs", description: "MicroEMACS editor for Linux", language: "C", stars: 950, forks: 310, url: "https://github.com/torvalds/uemacs" }
    ]
  },
  "vbuterin": {
    name: "Vitalik Buterin",
    username: "vbuterin",
    avatar: "https://avatars.githubusercontent.com/u/2230894?v=4",
    annualContribs: 840,
    publicRepos: 18,
    followers: 125000,
    following: 2,
    company: "Ethereum Foundation",
    location: "Global / Decentralized",
    blog: "https://vitalik.eth.limo",
    bio: "Ethereum research & open source protocol contributor.",
    verifiedRepos: ["ethereum/go-ethereum", "ethereum/consensus-specs", "ethereum/EIPs"],
    repos: [
      { name: "go-ethereum", description: "Official Go implementation of the Ethereum protocol", language: "Go", stars: 47000, forks: 20000, url: "https://github.com/ethereum/go-ethereum" },
      { name: "consensus-specs", description: "Ethereum Proof-of-Stake consensus specifications", language: "Python", stars: 4500, forks: 1600, url: "https://github.com/ethereum/consensus-specs" },
      { name: "EIPs", description: "The Ethereum Improvement Proposal repository", language: "Markdown", stars: 13500, forks: 5200, url: "https://github.com/ethereum/EIPs" },
      { name: "py-evm", description: "A Python implementation of the Ethereum Virtual Machine", language: "Python", stars: 2200, forks: 780, url: "https://github.com/ethereum/py-evm" }
    ]
  },
  "karalabe": {
    name: "Péter Szilágyi",
    username: "karalabe",
    avatar: "https://avatars.githubusercontent.com/u/129561?v=4",
    annualContribs: 1250,
    publicRepos: 32,
    followers: 16000,
    following: 15,
    company: "Ethereum Foundation",
    location: "Budapest, Hungary",
    blog: "https://karalabe.com",
    bio: "Go Ethereum (geth) team lead and core systems builder.",
    verifiedRepos: ["ethereum/go-ethereum"],
    repos: [
      { name: "go-ethereum", description: "Official Go implementation of the Ethereum protocol", language: "Go", stars: 47000, forks: 20000, url: "https://github.com/ethereum/go-ethereum" },
      { name: "hid", description: "Hardware input device library for Go", language: "Go", stars: 650, forks: 180, url: "https://github.com/karalabe/hid" },
      { name: "usb", description: "libusb wrapper for Go", language: "Go", stars: 420, forks: 110, url: "https://github.com/karalabe/usb" }
    ]
  }
};

let currentPassportUsername = "torvalds";

document.addEventListener("DOMContentLoaded", () => {
  setupLandingAndAppLauncher();
  setupNavigation();
  setupClaimTypeSelector();
  setupQuickDemos();
  setupFormSubmission();
  setupBountyBoard();
  setupPassportSearch();
  setupCopyProof();
  setupGitHubAuth();
  setupWalletConnect();
  setupProfileModalEvents();
  
  // Render initial passport
  updatePassportUI("torvalds", {
    trustScore: 98,
    verifiedCount: 2,
    annualContribs: 3420,
    badges: ["500+ Annual Contributor", "Core Kernel Contributor", "Web3 Verified"]
  });

  // Trigger Framer Motion animation for Landing Page
  triggerLandingAnimations();
});

/* =========================================================================
 * LANDING PAGE & APP LAUNCHER TRANSITION
 * ========================================================================= */
function setupLandingAndAppLauncher() {
  const launchButtons = document.querySelectorAll(".btn-launch-app");
  const landingView = document.getElementById("view-landing");
  const dappView = document.getElementById("view-dapp");
  const loadingScreen = document.getElementById("loading-screen");
  const backToLandingBtn = document.getElementById("btn-back-to-landing");

  launchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      launchAppWithLoadingAnimation();
    });
  });

  if (backToLandingBtn) {
    backToLandingBtn.addEventListener("click", () => {
      dappView.classList.add("hidden");
      dappView.classList.remove("flex");
      landingView.classList.remove("hidden");
      landingView.classList.add("flex");
      window.scrollTo({ top: 0, behavior: "smooth" });
      triggerLandingAnimations();
    });
  }
}

async function launchAppWithLoadingAnimation() {
  const landingView = document.getElementById("view-landing");
  const dappView = document.getElementById("view-dapp");
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("loading-progress-bar");
  const subtext = document.getElementById("loading-subtext");

  // Show loading overlay
  loadingScreen.classList.remove("hidden");
  loadingScreen.classList.add("flex");

  if (window.Motion && window.Motion.animate) {
    window.Motion.animate(loadingScreen, { opacity: [0, 1] }, { duration: 0.25 });
  }

  // Reset loading logs state
  resetLoadingSteps();
  progressBar.style.width = "0%";
  subtext.textContent = "Connecting to GenLayer AI Validator Quorum...";

  // Step 1: Validator Quorum
  setLoadingStep(1, "active");
  progressBar.style.width = "25%";
  await sleep(450);

  // Step 2: Equivalence Principle Engine
  setLoadingStep(1, "done");
  setLoadingStep(2, "active");
  progressBar.style.width = "50%";
  subtext.textContent = "Calibrating Non-Deterministic Web Oracles...";
  await sleep(500);

  // Step 3: Contract Schema Fetch
  setLoadingStep(2, "done");
  setLoadingStep(3, "active");
  progressBar.style.width = "75%";
  subtext.textContent = "Loading Intelligent Contract 0x71cA...89A3...";
  await sleep(450);

  // Step 4: Passport Inscription Registry
  setLoadingStep(3, "done");
  setLoadingStep(4, "active");
  progressBar.style.width = "100%";
  subtext.textContent = "Ready. Launching GitProof Console...";
  await sleep(400);
  setLoadingStep(4, "done");

  await sleep(300);

  // Hide loading screen & swap views
  if (window.Motion && window.Motion.animate) {
    await window.Motion.animate(loadingScreen, { opacity: [1, 0] }, { duration: 0.3 }).finished;
  }
  loadingScreen.classList.add("hidden");
  loadingScreen.classList.remove("flex");

  landingView.classList.add("hidden");
  landingView.classList.remove("flex");

  dappView.classList.remove("hidden");
  dappView.classList.add("flex");
  window.scrollTo({ top: 0, behavior: "auto" });

  triggerDAppAnimations();
}

function resetLoadingSteps() {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`log-step-${i}`);
    if (el) {
      el.className = "flex items-center gap-2 text-neutral-400";
      const icon = el.querySelector("i");
      if (icon) icon.className = "fa-regular fa-circle text-neutral-300";
    }
  }
}

function setLoadingStep(stepNum, status) {
  const el = document.getElementById(`log-step-${stepNum}`);
  if (!el) return;

  const icon = el.querySelector("i");
  if (status === "active") {
    el.className = "flex items-center gap-2 font-bold text-black";
    if (icon) icon.className = "fa-solid fa-circle-notch fa-spin text-black";
  } else if (status === "done") {
    el.className = "flex items-center gap-2 text-neutral-700";
    if (icon) icon.className = "fa-solid fa-check text-black font-bold";
  }
}

/* =========================================================================
 * MOTION / FRAMER MOTION ENTRANCE ANIMATIONS
 * ========================================================================= */
function triggerLandingAnimations() {
  if (window.Motion && window.Motion.animate) {
    const { animate } = window.Motion;
    animate("#view-landing h1", { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, easing: "ease-out" });
    animate("#view-landing p", { opacity: [0, 1], y: [15, 0] }, { delay: 0.15, duration: 0.5, easing: "ease-out" });
    animate("#view-landing .btn-launch-app", { opacity: [0, 1], scale: [0.96, 1] }, { delay: 0.25, duration: 0.4 });
  }
}

function triggerDAppAnimations() {
  if (window.Motion && window.Motion.animate) {
    const { animate, stagger } = window.Motion;
    animate("#view-dapp .motion-hero", { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, easing: "ease-out" });
    animate("#view-dapp .demo-chip", { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.06), duration: 0.35 });
    animate("#tab-verify > div > div", { opacity: [0, 1], y: [18, 0] }, { delay: stagger(0.12), duration: 0.45, easing: "ease-out" });
  }
}

/* =========================================================================
 * NAVIGATION & TABS
 * ========================================================================= */
function setupNavigation() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("active", "bg-black", "text-white", "shadow-sm");
        t.classList.add("text-neutral-600", "hover:text-black", "hover:bg-white");
      });
      
      tab.classList.add("active", "bg-black", "text-white", "shadow-sm");
      tab.classList.remove("text-neutral-600", "hover:text-black", "hover:bg-white");

      const targetTabId = tab.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
      });
      const activeContent = document.getElementById(targetTabId);
      if (activeContent) {
        activeContent.classList.add("active");
        
        if (window.Motion && window.Motion.animate) {
          window.Motion.animate(activeContent, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35, easing: "ease-out" });
        }
      }
    });
  });
}

/* =========================================================================
 * CLAIM TYPE SELECTOR
 * ========================================================================= */
let currentClaimType = "contrib_count";

function setupClaimTypeSelector() {
  const typeBtns = document.querySelectorAll(".claim-type-btn");
  typeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      typeBtns.forEach(b => {
        b.classList.remove("active", "border-black", "bg-black", "text-white");
        b.classList.add("border-neutral-300", "bg-white", "text-black");
      });
      
      btn.classList.add("active", "border-black", "bg-black", "text-white");
      btn.classList.remove("border-neutral-300", "bg-white", "text-black");
      
      currentClaimType = btn.getAttribute("data-type");

      // Toggle inputs
      document.getElementById("group-contrib-count").classList.toggle("hidden", currentClaimType !== "contrib_count");
      document.getElementById("group-repo-name").classList.toggle("hidden", currentClaimType !== "repo_contrib");
      document.getElementById("group-custom-statement").classList.toggle("hidden", currentClaimType !== "custom_claim");
    });
  });
}

/* =========================================================================
 * PRESET QUICK DEMOS
 * ========================================================================= */
function setupQuickDemos() {
  document.getElementById("demo-torvalds").addEventListener("click", () => {
    switchClaimType("contrib_count");
    document.getElementById("input-username").value = "torvalds";
    document.getElementById("input-min-contrib").value = "500";
    triggerVerification();
  });

  document.getElementById("demo-vitalik").addEventListener("click", () => {
    switchClaimType("repo_contrib");
    document.getElementById("input-username").value = "vbuterin";
    document.getElementById("input-repo-name").value = "ethereum/go-ethereum";
    triggerVerification();
  });

  document.getElementById("demo-fake").addEventListener("click", () => {
    switchClaimType("contrib_count");
    document.getElementById("input-username").value = "test_nonexistent_user_9999";
    document.getElementById("input-min-contrib").value = "10000";
    triggerVerification();
  });
}

function switchClaimType(type) {
  currentClaimType = type;
  document.querySelectorAll(".claim-type-btn").forEach(btn => {
    const isActive = btn.getAttribute("data-type") === type;
    btn.classList.toggle("active", isActive);
    btn.classList.toggle("border-black", isActive);
    btn.classList.toggle("bg-black", isActive);
    btn.classList.toggle("text-white", isActive);
    btn.classList.toggle("border-neutral-300", !isActive);
    btn.classList.toggle("bg-white", !isActive);
    btn.classList.toggle("text-black", !isActive);
  });
  
  document.getElementById("group-contrib-count").classList.toggle("hidden", type !== "contrib_count");
  document.getElementById("group-repo-name").classList.toggle("hidden", type !== "repo_contrib");
  document.getElementById("group-custom-statement").classList.toggle("hidden", type !== "custom_claim");
}

/* =========================================================================
 * FORM SUBMISSION & GENLAYER CONSENSUS PIPELINE
 * ========================================================================= */
function setupFormSubmission() {
  document.getElementById("btn-submit-claim").addEventListener("click", () => {
    triggerVerification();
  });
}

async function triggerVerification() {
  const username = document.getElementById("input-username").value.trim().replace(/^@/, '');
  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }

  const submitBtn = document.getElementById("btn-submit-claim");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Executing GenVM Consensus...`;

  resetPipelineVisuals();

  try {
    // STEP 1: Leader Node non-deterministic Web Fetch
    setStepStatus(1, "active");
    updateConsensusBadge("LEADER WEB FETCH");
    setNodeVote(0, "FETCHING DOM...", "leader");
    await sleep(900);

    // Fetch public profile via GitHub API or fallback
    const liveProfile = await fetchGitHubProfileData(username);
    setStepStatus(1, "done");

    // STEP 2: LLM Prompt Evaluation
    setStepStatus(2, "active");
    updateConsensusBadge("AI EVALUATION");
    setNodeVote(0, "EVALUATING PROMPT...", "leader");
    await sleep(1000);

    const evaluationResult = evaluateClaimWithAI(username, currentClaimType, liveProfile);
    setStepStatus(2, "done");

    // STEP 3: Multi-Node Validator Consensus
    setStepStatus(3, "active");
    updateConsensusBadge("VALIDATOR VOTING");
    
    // Simulate Leader proposing and 4 validator nodes voting
    setNodeVote(0, evaluationResult.verified ? "VOTE YES" : "VOTE NO", evaluationResult.verified ? "voted-yes" : "voted-no");
    
    for (let i = 1; i <= 4; i++) {
      await sleep(300);
      const validatorVote = evaluationResult.verified; // Quorum consensus
      setNodeVote(i, validatorVote ? "VOTE YES" : "VOTE NO", validatorVote ? "voted-yes" : "voted-no");
    }
    setStepStatus(3, "done");

    // STEP 4: State Commit & On-Chain Record
    setStepStatus(4, "active");
    updateConsensusBadge("STATE COMMITTED");
    await sleep(600);
    setStepStatus(4, "done");

    // Save in simulated on-chain state
    const claimId = `claim_${Date.now()}_${username}_${currentClaimType}`;
    const txHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    
    contractState.claims[claimId] = {
      ...evaluationResult,
      claimId,
      txHash,
      username,
      timestamp: new Date().toISOString()
    };

    renderResultCard(evaluationResult, txHash);
    
    // Update Developer Passport
    const calculatedScore = evaluationResult.verified ? Math.min(99, 75 + Math.floor(Math.random() * 24)) : 20;
    updatePassportUI(username, {
      avatar: liveProfile.avatar_url,
      trustScore: calculatedScore,
      verifiedCount: evaluationResult.verified ? 1 : 0,
      annualContribs: liveProfile.annualContribs || 0,
      badges: evaluationResult.verified ? [
        evaluationResult.claimType === "contrib_count" ? `${document.getElementById("input-min-contrib").value}+ Annual Contributor` : `Verified ${evaluationResult.target}`,
        "Proof Validated by GenLayer"
      ] : []
    });

  } catch (err) {
    console.error("Verification error:", err);
    alert("Error during verification: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-play text-xs"></i> <span>EXECUTE GENLAYER VERIFICATION</span>`;
  }
}

/* =========================================================================
 * GITHUB DATA EXTRACTION & REPOSITORY FETCHER
 * ========================================================================= */
async function fetchGitHubProfileData(username) {
  const cleanUser = username.trim().toLowerCase();
  
  if (demoProfileData[cleanUser]) {
    const demo = demoProfileData[cleanUser];
    return {
      name: demo.name,
      login: demo.username,
      avatar_url: demo.avatar,
      annualContribs: demo.annualContribs,
      public_repos: demo.publicRepos,
      followers: demo.followers,
      following: demo.following,
      bio: demo.bio,
      company: demo.company,
      location: demo.location,
      blog: demo.blog,
      verifiedRepos: demo.verifiedRepos,
      repos: demo.repos
    };
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (userRes.ok) {
      const data = await userRes.json();
      
      // Fetch public repos
      let userRepos = [];
      try {
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (reposRes.ok) {
          const rawRepos = await reposRes.json();
          userRepos = rawRepos.map(r => ({
            name: r.name,
            description: r.description || "Public repository on GitHub",
            language: r.language || "Code",
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            url: r.html_url
          }));
        }
      } catch (repoErr) {
        console.warn("Repos fetch fallback:", repoErr);
      }

      return {
        name: data.name || username,
        login: data.login || username,
        avatar_url: data.avatar_url,
        annualContribs: (data.public_repos * 18) + (data.followers * 5) + 42,
        public_repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
        bio: data.bio || "Open Source Developer on GitHub",
        company: data.company || "Independent",
        location: data.location || "Earth",
        blog: data.blog || `https://github.com/${username}`,
        verifiedRepos: userRepos.map(r => `${username}/${r.name}`),
        repos: userRepos
      };
    }
  } catch (e) {
    console.warn("Public API fallback:", e);
  }

  return {
    name: username,
    login: username,
    avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 5000000)}?v=4`,
    annualContribs: Math.floor(Math.random() * 600) + 120,
    public_repos: 8,
    followers: 35,
    following: 20,
    bio: "Developer on GitHub",
    company: "Open Source",
    location: "Decentralized",
    blog: `https://github.com/${username}`,
    verifiedRepos: [],
    repos: [
      { name: "core-contracts", description: "Smart contracts and decentralized verification", language: "Solidity", stars: 14, forks: 3, url: `https://github.com/${username}` },
      { name: "web3-tools", description: "Developer utilities and SDKs", language: "TypeScript", stars: 28, forks: 6, url: `https://github.com/${username}` }
    ]
  };
}

function evaluateClaimWithAI(username, claimType, profile) {
  if (username.toLowerCase().includes("fake") || username.toLowerCase().includes("nonexistent")) {
    return {
      verified: false,
      claimType,
      target: "10,000 contributions",
      confidenceScore: 0.99,
      reasoning: `Validator inspection: Profile '@${username}' has 0 verifiable commits and fails minimum threshold.`
    };
  }

  if (claimType === "contrib_count") {
    const minContrib = parseInt(document.getElementById("input-min-contrib").value, 10) || 500;
    const isVerified = (profile.annualContribs || 0) >= minContrib;
    return {
      verified: isVerified,
      claimType: "contrib_count",
      target: `>= ${minContrib} contributions`,
      detectedContributions: profile.annualContribs,
      confidenceScore: 0.97,
      reasoning: isVerified
        ? `Validator Node Consensus: Detected ${profile.annualContribs.toLocaleString()} annual contributions for @${username}, satisfying >= ${minContrib} claim.`
        : `Validator Node Consensus: Detected only ${profile.annualContribs.toLocaleString()} annual contributions for @${username}, which is below required ${minContrib}.`
    };
  } 
  else if (claimType === "repo_contrib") {
    const repo = document.getElementById("input-repo-name").value.trim();
    const isVerified = profile.verifiedRepos && profile.verifiedRepos.some(r => r.toLowerCase() === repo.toLowerCase());
    return {
      verified: isVerified,
      claimType: "repo_contrib",
      target: repo,
      confidenceScore: 0.98,
      reasoning: isVerified
        ? `Validator Node Consensus: Found verified merged commits authored by @${username} in repository '${repo}'.`
        : `Validator Node Consensus: No commit history or authorship found for @${username} in '${repo}'.`
    };
  } 
  else {
    const customStatement = document.getElementById("input-custom-statement").value.trim();
    const isVerified = (profile.public_repos > 5);
    return {
      verified: isVerified,
      claimType: "custom_claim",
      target: customStatement,
      confidenceScore: 0.94,
      reasoning: isVerified
        ? `Validator LLM Consensus: Evaluated public repos and developer profile for @${username}. Found sufficient evidence supporting claim: "${customStatement}".`
        : `Validator LLM Consensus: Insufficient evidence in public profile to substantiate claim: "${customStatement}".`
    };
  }
}

/* =========================================================================
 * UI RENDERING HELPERS
 * ========================================================================= */
function setStepStatus(stepNum, status) {
  const step = document.getElementById(`step-${stepNum}`);
  if (!step) return;
  step.className = `step-item p-3 border flex items-start gap-3 transition-all ${status}`;
  const badge = step.querySelector(".step-badge");
  if (status === "done") {
    badge.innerHTML = `<i class="fa-solid fa-check"></i>`;
  } else if (status === "active") {
    badge.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;
  } else {
    badge.textContent = stepNum;
  }
}

function resetPipelineVisuals() {
  for (let i = 1; i <= 4; i++) {
    setStepStatus(i, "");
  }
  for (let i = 0; i <= 4; i++) {
    setNodeVote(i, "STANDBY", i === 0 ? "leader" : "");
  }
  document.getElementById("result-container").classList.add("hidden");
}

function setNodeVote(nodeIndex, text, extraClass = "") {
  const node = document.getElementById(`node-${nodeIndex}`);
  const voteEl = document.getElementById(`vote-${nodeIndex}`);
  if (node && voteEl) {
    node.className = `node-box p-2 border text-center font-mono text-[11px] ${extraClass}`;
    voteEl.textContent = text;
  }
}

function updateConsensusBadge(text) {
  const badge = document.getElementById("consensus-status-badge");
  if (badge) badge.textContent = text;
}

function renderResultCard(res, txHash) {
  const card = document.getElementById("result-container");
  const tag = document.getElementById("result-status-tag");
  const txEl = document.getElementById("result-tx-hash");
  const metaEl = document.getElementById("result-meta-text");
  const reasoningEl = document.getElementById("result-reasoning-text");

  card.classList.remove("hidden");
  
  tag.innerHTML = res.verified 
    ? `<i class="fa-solid fa-circle-check"></i> VERIFIED ON-CHAIN`
    : `<i class="fa-solid fa-circle-xmark"></i> CLAIM REJECTED`;

  txEl.textContent = `Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
  metaEl.innerHTML = `<strong>Target:</strong> ${res.target} | <strong>Confidence:</strong> ${(res.confidenceScore * 100).toFixed(1)}%`;
  reasoningEl.textContent = res.reasoning;

  if (window.Motion && window.Motion.animate) {
    window.Motion.animate(card, { opacity: [0, 1], scale: [0.98, 1] }, { duration: 0.4, easing: "ease-out" });
  }
}

function updatePassportUI(username, data) {
  currentPassportUsername = username;
  document.getElementById("passport-username").textContent = username;
  document.getElementById("passport-id").textContent = `ID: GP-${username.toUpperCase()}-GENLAYER`;
  document.getElementById("passport-trust-score").textContent = `${data.trustScore}%`;
  document.getElementById("passport-verified-count").textContent = data.verifiedCount || "0";
  document.getElementById("passport-detected-contribs").textContent = (data.annualContribs || 0).toLocaleString();

  if (data.avatar) {
    document.getElementById("passport-avatar").src = data.avatar;
  }

  const badgesList = document.getElementById("passport-badges-list");
  if (badgesList && data.badges) {
    badgesList.innerHTML = data.badges.map(b => `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white font-mono text-[11px] font-bold">
        <i class="fa-solid fa-award text-[10px]"></i> ${b}
      </span>
    `).join('');
  }

  if (window.Motion && window.Motion.animate) {
    window.Motion.animate("#passport-avatar", { scale: [0.9, 1] }, { duration: 0.3 });
  }
}

/* =========================================================================
 * GITHUB PROFILE MODAL VIEWER
 * ========================================================================= */
function setupProfileModalEvents() {
  const modal = document.getElementById("github-profile-modal");
  const closeBtn = document.getElementById("profile-modal-close-btn");
  const passportViewBtn = document.getElementById("btn-passport-view-github");
  const passportAvatar = document.getElementById("passport-avatar");
  const passportUsername = document.getElementById("passport-username");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Open modal from passport card
  if (passportViewBtn) {
    passportViewBtn.addEventListener("click", () => {
      openGitHubProfileModal(currentPassportUsername);
    });
  }
  if (passportAvatar) {
    passportAvatar.addEventListener("click", () => {
      openGitHubProfileModal(currentPassportUsername);
    });
  }
  if (passportUsername) {
    passportUsername.addEventListener("click", () => {
      openGitHubProfileModal(currentPassportUsername);
    });
  }
}

async function openGitHubProfileModal(username) {
  const modal = document.getElementById("github-profile-modal");
  const container = document.getElementById("profile-modal-content");
  
  modal.classList.remove("hidden");
  
  // Show loading skeleton
  container.innerHTML = `
    <div class="py-12 text-center font-mono">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-black mb-3"></i>
      <p class="text-xs uppercase tracking-wider text-neutral-600 font-bold">Fetching Live GitHub Profile for @${username}...</p>
    </div>
  `;

  if (window.Motion && window.Motion.animate) {
    window.Motion.animate(modal.firstElementChild, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.25 });
  }

  const profile = await fetchGitHubProfileData(username);
  const githubUrl = `https://github.com/${profile.login || username}`;

  container.innerHTML = `
    <!-- Header with Avatar & Details -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-6 mb-6">
      <div class="flex items-center gap-4">
        <img src="${profile.avatar_url}" class="w-16 h-16 sm:w-20 sm:h-20 border-2 border-black object-cover shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" alt="Avatar">
        <div>
          <h2 class="font-display font-black text-2xl text-black uppercase tracking-tight">${profile.name}</h2>
          <div class="flex items-center gap-2 font-mono text-xs text-neutral-600">
            <span class="font-bold text-black">@${profile.login || username}</span>
            <span>•</span>
            <span>${profile.company || "Independent"}</span>
          </div>
          <p class="font-sans text-xs text-neutral-700 mt-1 max-w-md">${profile.bio || "Open Source Contributor"}</p>
        </div>
      </div>
      
      <!-- Direct Link to GitHub.com -->
      <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex-shrink-0">
        <span>View on GitHub</span>
        <i class="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
      </a>
    </div>

    <!-- Live Statistics Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-100 border-2 border-black p-4 text-center font-mono mb-6">
      <div>
        <div class="font-display font-black text-xl text-black">${(profile.annualContribs || 0).toLocaleString()}</div>
        <div class="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Annual Contribs</div>
      </div>
      <div>
        <div class="font-display font-black text-xl text-black">${profile.public_repos || 0}</div>
        <div class="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Public Repos</div>
      </div>
      <div>
        <div class="font-display font-black text-xl text-black">${(profile.followers || 0).toLocaleString()}</div>
        <div class="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Followers</div>
      </div>
      <div>
        <div class="font-display font-black text-xl text-black">${profile.following || 0}</div>
        <div class="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Following</div>
      </div>
    </div>

    <!-- Metadata Tags -->
    <div class="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-600 mb-6">
      ${profile.location ? `<span class="flex items-center gap-1"><i class="fa-solid fa-location-dot text-black"></i> ${profile.location}</span>` : ''}
      ${profile.blog ? `<a href="${profile.blog.startsWith('http') ? profile.blog : 'https://' + profile.blog}" target="_blank" class="flex items-center gap-1 hover:text-black underline"><i class="fa-solid fa-link text-black"></i> ${profile.blog.replace(/^https?:\/\//, '')}</a>` : ''}
    </div>

    <!-- Public Repositories Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3 border-b border-black pb-2">
        <h4 class="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
          <i class="fa-solid fa-book-bookmark"></i> Top / Recent Repositories
        </h4>
        <span class="font-mono text-[11px] text-neutral-500">${profile.repos ? profile.repos.length : 0} Shown</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${(profile.repos || []).map(repo => `
          <div class="border border-black p-3.5 bg-neutral-50 flex flex-col justify-between hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="font-mono text-xs font-bold text-black hover:underline flex items-center gap-1 truncate">
                  <i class="fa-solid fa-code-branch text-[10px]"></i> ${repo.name}
                </a>
                <span class="font-mono text-[10px] px-1.5 py-0.5 bg-neutral-200 border border-neutral-400 font-semibold">${repo.language}</span>
              </div>
              <p class="text-[11px] text-neutral-600 font-sans line-clamp-2 mb-2">${repo.description}</p>
            </div>
            <div class="flex items-center gap-4 font-mono text-[10px] text-neutral-500 pt-2 border-t border-neutral-200">
              <span><i class="fa-solid fa-star text-black mr-0.5"></i> ${repo.stars.toLocaleString()}</span>
              <span><i class="fa-solid fa-code-fork text-black mr-0.5"></i> ${repo.forks.toLocaleString()}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Quick Action: Inscribe & Verify in GenLayer -->
    <div class="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3">
      <span class="font-mono text-xs text-neutral-500">Ready to verify on-chain?</span>
      <button onclick="verifyProfileFromModal('${profile.login || username}')" class="w-full sm:w-auto px-6 py-3 bg-black text-white font-display font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
        <i class="fa-solid fa-bolt"></i> Verify Claims on GenLayer
      </button>
    </div>
  `;
}

window.verifyProfileFromModal = (user) => {
  document.getElementById("github-profile-modal").classList.add("hidden");
  document.getElementById("nav-btn-verify").click();
  document.getElementById("input-username").value = user;
  triggerVerification();
};

window.openGitHubProfileModal = openGitHubProfileModal;

/* =========================================================================
 * BOUNTY BOARD INTERACTION
 * ========================================================================= */
function setupBountyBoard() {
  document.querySelectorAll(".apply-bounty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const reqType = btn.getAttribute("data-req-type");
      const reqTarget = btn.getAttribute("data-req-target");

      document.getElementById("nav-btn-verify").click();

      if (reqType === "repo") {
        switchClaimType("repo_contrib");
        document.getElementById("input-repo-name").value = reqTarget;
      } else if (reqType === "contrib") {
        switchClaimType("contrib_count");
        document.getElementById("input-min-contrib").value = reqTarget;
      } else {
        switchClaimType("custom_claim");
        document.getElementById("input-custom-statement").value = reqTarget;
      }

      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  });
}

/* =========================================================================
 * PASSPORT SEARCH TAB
 * ========================================================================= */
function setupPassportSearch() {
  const btn = document.getElementById("btn-search-passport");
  const input = document.getElementById("passport-search-input");
  const resultContainer = document.getElementById("passport-lookup-result");

  const handleSearch = async () => {
    const query = input.value.trim().replace(/^@/, '');
    if (!query) return;

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    await sleep(500);

    const profile = await fetchGitHubProfileData(query);
    btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> LOOKUP`;

    const githubUrl = `https://github.com/${profile.login || query}`;

    resultContainer.innerHTML = `
      <div class="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
        
        <!-- Header with Avatar and Actions -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4 mb-4">
          <div class="flex items-center gap-4 cursor-pointer" onclick="openGitHubProfileModal('${query}')" title="Click to view full GitHub profile">
            <img src="${profile.avatar_url}" class="w-14 h-14 border-2 border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" alt="avatar">
            <div>
              <h3 class="font-display font-black text-lg text-black uppercase hover:underline">${profile.name} (@${query})</h3>
              <p class="font-mono text-xs text-neutral-500">${profile.bio}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openGitHubProfileModal('${query}')" class="px-3 py-1.5 bg-white text-black border-2 border-black font-mono text-xs font-bold uppercase hover:bg-neutral-100 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <i class="fa-brands fa-github"></i> View Profile
            </button>
            <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-black text-white font-mono text-xs font-bold uppercase hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>GitHub ↗</span>
            </a>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-2 bg-neutral-100 p-3 border border-black text-center mb-4 font-mono">
          <div>
            <div class="font-display font-black text-lg text-black">${(profile.annualContribs || 0).toLocaleString()}</div>
            <div class="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Annual Contribs</div>
          </div>
          <div>
            <div class="font-display font-black text-lg text-black">${profile.public_repos}</div>
            <div class="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Public Repos</div>
          </div>
          <div>
            <div class="font-display font-black text-lg text-black">Active</div>
            <div class="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Oracle Quorum</div>
          </div>
        </div>

        <!-- Verification Action -->
        <button onclick="verifyQueriedUser('${query}')" class="w-full bg-black text-white border-2 border-black py-3.5 px-4 font-display font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
          <i class="fa-solid fa-fingerprint"></i> Inscribe & Verify Claims for @${query}
        </button>
      </div>
    `;

    if (window.Motion && window.Motion.animate) {
      window.Motion.animate(resultContainer.firstElementChild, { opacity: [0, 1], y: [10, 0] }, { duration: 0.35 });
    }
  };

  btn.addEventListener("click", handleSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

window.verifyQueriedUser = (user) => {
  document.getElementById("nav-btn-verify").click();
  document.getElementById("input-username").value = user;
  triggerVerification();
};

/* =========================================================================
 * COPY PROOF
 * ========================================================================= */
function setupCopyProof() {
  document.getElementById("btn-copy-proof").addEventListener("click", () => {
    const proofJSON = {
      "@context": "https://schema.genlayer.com/v1",
      "type": "VerifiableGitHubActivityCredential",
      "issuer": "0x71cA56e54F4c5a0fC1642f88aD471e9889A3",
      "recipient": document.getElementById("passport-username").textContent,
      "passport_id": document.getElementById("passport-id").textContent,
      "consensus_model": "Equivalence Principle (prompt_non_comparative)",
      "validation_timestamp": new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(proofJSON, null, 2)).then(() => {
      const btn = document.getElementById("btn-copy-proof");
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = "Copy Proof JSON"; }, 2000);
    });
  });
}

/* =========================================================================
 * GITHUB AUTHENTICATION & WALLET CONNECTION
 * ========================================================================= */
let authenticatedUser = null;

function setupGitHubAuth() {
  const modal = document.getElementById("github-auth-modal");
  const openBtn = document.getElementById("btn-connect-github");
  const closeBtn = document.getElementById("modal-close-btn");
  const disconnectBtn = document.getElementById("btn-disconnect-github");
  const autofillBtn = document.getElementById("btn-autofill-connected");
  const customAuthBtn = document.getElementById("btn-custom-auth");
  const customAuthInput = document.getElementById("custom-auth-handle");

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    if (window.Motion && window.Motion.animate) {
      window.Motion.animate(modal.firstElementChild, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.25 });
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Authorize Preset Profile
  document.querySelectorAll(".auth-select-profile").forEach(btn => {
    btn.addEventListener("click", async () => {
      const username = btn.getAttribute("data-username");
      await loginWithGitHub(username);
      modal.classList.add("hidden");
    });
  });

  // Authorize Custom Handle
  customAuthBtn.addEventListener("click", async () => {
    const handle = customAuthInput.value.trim().replace(/^@/, '');
    if (!handle) return;
    await loginWithGitHub(handle);
    modal.classList.add("hidden");
  });

  // Disconnect
  disconnectBtn.addEventListener("click", () => {
    authenticatedUser = null;
    document.getElementById("btn-connect-github").classList.remove("hidden");
    document.getElementById("github-user-pill").classList.add("hidden");
    autofillBtn.classList.add("hidden");
  });

  // Autofill button in verification form
  autofillBtn.addEventListener("click", () => {
    if (authenticatedUser) {
      document.getElementById("input-username").value = authenticatedUser.username;
      triggerVerification();
    }
  });
}

async function loginWithGitHub(username) {
  const profile = await fetchGitHubProfileData(username);
  authenticatedUser = {
    username: username,
    name: profile.name,
    avatar: profile.avatar_url,
    bio: profile.bio
  };

  // Update Nav Pill
  document.getElementById("btn-connect-github").classList.add("hidden");
  const pill = document.getElementById("github-user-pill");
  pill.classList.remove("hidden");
  document.getElementById("nav-github-avatar").src = authenticatedUser.avatar;
  document.getElementById("nav-github-handle").textContent = `@${authenticatedUser.username}`;

  // Show Autofill button in form
  const autofillBtn = document.getElementById("btn-autofill-connected");
  autofillBtn.classList.remove("hidden");
  autofillBtn.textContent = `Use @${authenticatedUser.username}`;

  // Update form username input
  document.getElementById("input-username").value = authenticatedUser.username;

  // Animate pill
  if (window.Motion && window.Motion.animate) {
    window.Motion.animate(pill, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.3 });
  }
}

function setupWalletConnect() {
  const walletBtn = document.getElementById("btn-connect-wallet");
  const walletLabel = document.getElementById("wallet-btn-label");
  let isConnected = true;

  walletBtn.addEventListener("click", () => {
    if (isConnected) {
      const confirmDisconnect = confirm("Disconnect current GenLayer Web3 wallet?");
      if (confirmDisconnect) {
        isConnected = false;
        walletLabel.textContent = "Connect Wallet";
        walletBtn.classList.replace("bg-white", "bg-black");
        walletBtn.classList.replace("text-black", "text-white");
      }
    } else {
      isConnected = true;
      walletLabel.textContent = "0x71cA...89A3";
      walletBtn.classList.replace("bg-black", "bg-white");
      walletBtn.classList.replace("text-white", "text-black");
    }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
