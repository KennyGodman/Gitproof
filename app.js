/**
 * GitProof - Frontend Logic & GenLayer Consensus Simulator
 * Enhanced with Motion / Framer Motion Animations & Tailwind UI
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
    bio: "Creator of Linux and Git",
    verifiedRepos: ["torvalds/linux", "git/git"]
  },
  "vbuterin": {
    name: "Vitalik Buterin",
    username: "vbuterin",
    avatar: "https://avatars.githubusercontent.com/u/2230894?v=4",
    annualContribs: 840,
    publicRepos: 18,
    bio: "Ethereum research & open source contributor",
    verifiedRepos: ["ethereum/go-ethereum", "ethereum/consensus-specs", "ethereum/EIPs"]
  },
  "karalabe": {
    name: "Péter Szilágyi",
    username: "karalabe",
    avatar: "https://avatars.githubusercontent.com/u/129561?v=4",
    annualContribs: 1250,
    publicRepos: 32,
    bio: "Go Ethereum (geth) team lead",
    verifiedRepos: ["ethereum/go-ethereum"]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupClaimTypeSelector();
  setupQuickDemos();
  setupFormSubmission();
  setupBountyBoard();
  setupPassportSearch();
  setupCopyProof();
  setupGitHubAuth();
  setupWalletConnect();
  
  // Render initial passport
  updatePassportUI("torvalds", {
    trustScore: 98,
    verifiedCount: 2,
    annualContribs: 3420,
    badges: ["500+ Annual Contributor", "Core Kernel Contributor", "Web3 Verified"]
  });

  // Trigger Framer Motion / Motion animation
  triggerEntranceAnimations();
});

/* =========================================================================
 * MOTION / FRAMER MOTION ENTRANCE ANIMATIONS
 * ========================================================================= */
function triggerEntranceAnimations() {
  if (window.Motion && window.Motion.animate) {
    const { animate, stagger } = window.Motion;
    
    // Animate hero
    animate(".motion-hero", { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, easing: "ease-out" });
    
    // Animate demo chips with stagger
    animate(".demo-chip", { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.08), duration: 0.4 });
    
    // Animate cards
    animate("#tab-verify > div > div", { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.15), duration: 0.5, easing: "ease-out" });
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
 * GITHUB DATA EXTRACTION & AI EVALUATION LOGIC
 * ========================================================================= */
async function fetchGitHubProfileData(username) {
  if (demoProfileData[username.toLowerCase()]) {
    const demo = demoProfileData[username.toLowerCase()];
    return {
      name: demo.name,
      avatar_url: demo.avatar,
      annualContribs: demo.annualContribs,
      public_repos: demo.publicRepos,
      bio: demo.bio,
      verifiedRepos: demo.verifiedRepos
    };
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.name || username,
        avatar_url: data.avatar_url,
        annualContribs: (data.public_repos * 18) + (data.followers * 5) + 42,
        public_repos: data.public_repos,
        bio: data.bio || "Open Source Developer",
        verifiedRepos: []
      };
    }
  } catch (e) {
    console.warn("Public API fallback:", e);
  }

  return {
    name: username,
    avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 5000000)}?v=4`,
    annualContribs: Math.floor(Math.random() * 600),
    public_repos: 12,
    bio: "Developer on GitHub",
    verifiedRepos: []
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
    await sleep(600);

    const profile = await fetchGitHubProfileData(query);
    btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> LOOKUP`;

    resultContainer.innerHTML = `
      <div class="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
        <div class="flex items-center gap-4 border-b-2 border-black pb-4 mb-4">
          <img src="${profile.avatar_url}" class="w-14 h-14 border-2 border-black object-cover" alt="avatar">
          <div>
            <h3 class="font-display font-black text-lg text-black uppercase">${profile.name} (@${query})</h3>
            <p class="font-mono text-xs text-neutral-500">${profile.bio}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 bg-neutral-100 p-3 border border-black text-center mb-4">
          <div>
            <div class="font-display font-black text-lg text-black">${(profile.annualContribs || 0).toLocaleString()}</div>
            <div class="font-mono text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Annual Contribs</div>
          </div>
          <div>
            <div class="font-display font-black text-lg text-black">${profile.public_repos}</div>
            <div class="font-mono text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Public Repos</div>
          </div>
          <div>
            <div class="font-display font-black text-lg text-black">Active</div>
            <div class="font-mono text-[9px] uppercase tracking-wider text-neutral-500 font-bold">Oracle Quorum</div>
          </div>
        </div>
        <button onclick="verifyQueriedUser('${query}')" class="w-full bg-black text-white border-2 border-black py-3 px-4 font-display font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
          <i class="fa-solid fa-fingerprint"></i> Verify Claims for @${query}
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
