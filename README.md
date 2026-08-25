# GitProof - GitHub Activity Verifier on GenLayer ⚡

> **Intelligent Smart Contract for Decentralized GitHub Activity & Contribution Verification using GenLayer and AI Consensus.**

---

## 📌 Overview

**GitProof** allows developers to prove real-world GitHub achievements on-chain:
- *"I have 500+ GitHub contributions in the past year."*
- *"I contributed code/commits to `ethereum/go-ethereum`."*
- *"I am an active open source maintainer of Rust/Solidity projects."*

Traditional blockchains cannot fetch web pages or reach consensus on unstructured text. **GenLayer** solves this via **Intelligent Contracts** running on the **GenVM**, leveraging **Non-Deterministic Web Access** and **LLM Validator Consensus** governed by the **Equivalence Principle**.

---

## 🏛️ Architecture & How GenLayer Works

```mermaid
sequenceDiagram
    autonumber
    actor User as Web3 Developer / Bounty Hunter
    participant DApp as GitProof Frontend
    participant Leader as Leader Validator Node
    participant GitHub as Public GitHub Web / API
    participant Nodes as Validator Quorum (Nodes 2-5)
    participant State as GenLayer On-Chain State

    User->>DApp: Submit Claim ("@torvalds >= 500 contributions")
    DApp->>Leader: Call verify_contribution_count(username, min_contributions)
    
    rect rgb(20, 30, 50)
    Note over Leader,GitHub: Non-Deterministic Execution (gl.nondet)
    Leader->>GitHub: gl.nondet.web.render("https://github.com/torvalds")
    GitHub-->>Leader: Public DOM / Profile HTML
    Leader->>Leader: gl.nondet.exec_prompt(ai_analysis_prompt)
    end

    rect rgb(30, 40, 60)
    Note over Leader,Nodes: Equivalence Principle Consensus
    Leader->>Nodes: Propose Result via gl.eq_principle.prompt_non_comparative
    Nodes->>Nodes: Validate against criteria (JSON schema, evidence matching)
    Nodes-->>State: Quorum agreement reached
    end

    State->>State: Store Claim Record & Mint Verifiable Badges
    State-->>DApp: Return Verified Claim & Updated Dev Passport
    DApp-->>User: Display Holographic Passport & Credential Export
```

### 1. Non-Deterministic Data Fetching (`gl.nondet.web`)
The contract uses `gl.nondet.web.render(profile_url, mode='html')` or `gl.nondet.web.get(commits_url)` to fetch real-time public GitHub data without needing a centralized oracle.

### 2. AI Reasoning & Extraction (`gl.nondet.exec_prompt`)
The leader node submits the raw HTML and claim to an LLM inside the GenVM sandbox. The model analyzes contributions, commit messages, and PR activity, producing structured JSON verification proof.

### 3. Equivalence Principle Consensus (`gl.eq_principle.prompt_non_comparative`)
Rather than requiring strict word-for-word identical strings (which fails for LLM outputs), GenLayer validators evaluate whether the proposed verification fulfills the designated criteria (correct JSON schema, substantiated evidence, accurate booleans).

---

## 📂 Project Structure

```
Gitproof/
├── contracts/
│   ├── github_verifier.py       # GenLayer Python Intelligent Contract
│   └── test_github_verifier.py  # Mock GenVM consensus & unit test suite
├── frontend/
│   ├── index.html               # Web3 DApp with Claim Console & Dev Passport
│   ├── styles.css               # Modern glassmorphic Web3 dark theme
│   └── app.js                   # Consensus pipeline simulation & GitHub data extractor
└── README.md                    # Project documentation
```

---

## 🚀 Quickstart & Local Setup

### 1. Run the Frontend Locally
You can serve the frontend with any static HTTP server:

```bash
# Using Node.js npx serve
npx serve frontend -p 3000

# OR using Python
python -m http.server 3000 --directory frontend
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Intelligent Contract Tests
```bash
python contracts/test_github_verifier.py
```

### 3. Deploy to GenLayer
Using the GenLayer CLI or [GenLayer Studio](https://studio.genlayer.com/):

```bash
# 1. Lint the Python contract for GenVM rules
genvm-lint check contracts/github_verifier.py

# 2. Deploy to GenLayer Testnet
genlayer deploy contracts/github_verifier.py
```

---

## 💡 Web3 Use Cases

1. **Decentralized Hiring & Talent DAOs**:
   Automatically filter candidates for core engineering roles based on proven open-source contributions.
2. **Automated Bounty Payouts**:
   Smart contracts instantly disburse rewards once a developer proves they authored and merged a PR or commit to a target repository.
3. **Sybil-Resistant Airdrops & Grants**:
   Distribute tokens or quadratic funding votes exclusively to verifiable developers with >100 contributions.
4. **Verifiable Developer Passports**:
   Self-sovereign developer credentials that can be attached to decentralized profiles (e.g. ENS, Lens, Farcaster).
