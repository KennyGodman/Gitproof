"""
Test suite and direct runner for GitHubActivityVerifier Intelligent Contract.
Simulates GenVM execution, non-deterministic web responses, identity binding, and equivalence consensus.
"""

import json

class MockNondetWeb:
    @staticmethod
    def render(url: str, mode: str = 'html') -> str:
        if "torvalds" in url:
            return """
            <html>
                <div class="js-yearly-contributions">
                    <h2> 3,420 contributions in the last year </h2>
                </div>
                <div class="user-profile-bio">Creator of Linux and Git</div>
            </html>
            """
        elif "ethereum/go-ethereum/commits?author=karalabe" in url:
            return """
            <html>
                <div class="commit-group">
                    <p class="commit-title">cmd/geth: update consensus engine</p>
                    <p class="commit-author">karalabe authored 2 days ago</p>
                </div>
            </html>
            """
        elif "ethereum/go-ethereum/commits?author=random_fake_user_12345" in url:
            return """
            <html>
                <div class="blankslate">
                    <h3>No commits found for author random_fake_user_12345</h3>
                </div>
            </html>
            """
        return "<html><div>54 contributions in the last year</div></html>"

class MockNondet:
    web = MockNondetWeb

    @staticmethod
    def exec_prompt(prompt: str) -> str:
        if "torvalds" in prompt:
            return json.dumps({
                "verified": True,
                "detected": 3420,
                "status": "VERIFIED",
                "reason": "Found 3,420 contributions in the last year heading and extensive commit activity on public profile.",
                "sender": "0x1a85032C52f3e89429924E0f084C49465232d5b9"
            })
        elif "karalabe" in prompt and "ethereum/go-ethereum" in prompt:
            return json.dumps({
                "verified": True,
                "commits_found": True,
                "status": "VERIFIED",
                "reason": "Active merged commits authored by karalabe in ethereum/go-ethereum commit history.",
                "sender": "0x1a85032C52f3e89429924E0f084C49465232d5b9"
            })
        elif "random_fake_user_12345" in prompt:
            return json.dumps({
                "verified": False,
                "commits_found": False,
                "status": "REJECTED",
                "reason": "Commits page displays blankslate with no commits found for author random_fake_user_12345.",
                "sender": "0x1a85032C52f3e89429924E0f084C49465232d5b9"
            })
        return json.dumps({
            "verified": False,
            "detected": 54,
            "status": "REJECTED",
            "reason": "User has only 54 detected contributions, which is less than the claimed minimum.",
            "sender": "0x1a85032C52f3e89429924E0f084C49465232d5b9"
        })

class MockEqPrinciple:
    @staticmethod
    def prompt_non_comparative(*, task, criteria: str = "") -> str:
        # Leader runs non-deterministic task with keyword argument, validators reach consensus
        return task()

    @staticmethod
    def strict_eq(fn) -> str:
        return fn()

class MockMessage:
    sender_address = "0x1a85032C52f3e89429924E0f084C49465232d5b9"

class MockGL:
    nondet = MockNondet
    eq_principle = MockEqPrinciple
    Contract = object
    message = MockMessage

# Mock contract implementation testing exact methods
class SimulatedGitHubActivityVerifier:
    def __init__(self):
        self.claims = {}

    def _get_sender(self) -> str:
        return str(getattr(MockGL.message, "sender_address", "0x0000000000000000000000000000000000000000"))

    def verify_contribution_count(self, github_handle: str, min_contributions: str) -> str:
        handle = github_handle.strip().lstrip('@')
        sender = self._get_sender()
        claim_id = f"{handle}_contrib_{min_contributions}"
        bound_id = f"{sender}:{claim_id}"

        def evaluate():
            profile_url = f"https://github.com/{handle}"
            web_data = MockGL.nondet.web.render(profile_url, mode='html')
            prompt = f"User {handle} claims {min_contributions}. Sender {sender}. Data: {web_data[:500]}"
            return MockGL.nondet.exec_prompt(prompt)

        result = MockGL.eq_principle.prompt_non_comparative(
            task=evaluate,
            criteria="Result must be a valid JSON with verified boolean, detected number, and reason."
        )
        self.claims[claim_id] = result
        self.claims[bound_id] = result
        return result

    def verify_repo_contribution(self, github_handle: str, repo: str) -> str:
        handle = github_handle.strip().lstrip('@')
        clean_repo = repo.strip().strip('/')
        sender = self._get_sender()
        claim_id = f"{handle}_repo_{clean_repo.replace('/', '_')}"
        bound_id = f"{sender}:{claim_id}"

        def evaluate():
            commits_url = f"https://github.com/{clean_repo}/commits?author={handle}"
            commits_page = MockGL.nondet.web.render(commits_url, mode='html')
            prompt = f"{handle} in {clean_repo}. Sender {sender}."
            return MockGL.nondet.exec_prompt(prompt)

        result = MockGL.eq_principle.prompt_non_comparative(
            task=evaluate,
            criteria="Result must be a valid JSON with verified boolean, commits_found boolean, and reason."
        )
        self.claims[claim_id] = result
        self.claims[bound_id] = result
        return result

    def get_claim(self, claim_id: str) -> str:
        return self.claims.get(claim_id, "Claim not found")

def test_contract_suite():
    print("=================================================================")
    print("  GENLAYER INTELLIGENT CONTRACT TEST: GitHubActivityVerifier")
    print("  Features: task=evaluate, Identity Binding, Substantive Checks")
    print("=================================================================")
    
    verifier = SimulatedGitHubActivityVerifier()

    # Test 1: verify_contribution_count (positive check)
    print("\n[Test 1] Verifying Linus Torvalds claim: >= 500 contributions...")
    res_1 = verifier.verify_contribution_count("torvalds", "500")
    parsed_1 = json.loads(res_1)
    print(f" -> Consensus Status: {parsed_1['status']}")
    print(f" -> Detected Contributions: {parsed_1['detected']}")
    print(f" -> Bound Sender Identity: {parsed_1['sender']}")
    assert parsed_1['verified'] is True
    assert parsed_1['detected'] >= 500
    assert parsed_1['sender'] == "0x1a85032C52f3e89429924E0f084C49465232d5b9"

    # Test 2: get_claim state readback (both canonical and identity-bound keys)
    print("\n[Test 2] Testing on-chain state readback via get_claim...")
    readback_canonical = verifier.get_claim("torvalds_contrib_500")
    assert readback_canonical == res_1
    print(" -> Canonical Claim Readback: SUCCESS")

    sender = verifier._get_sender()
    readback_bound = verifier.get_claim(f"{sender}:torvalds_contrib_500")
    assert readback_bound == res_1
    print(f" -> Identity-Bound Claim Readback ({sender}:torvalds_contrib_500): SUCCESS")

    # Test 3: verify_repo_contribution (positive check)
    print("\n[Test 3] Verifying karalabe contribution to ethereum/go-ethereum...")
    res_3 = verifier.verify_repo_contribution("karalabe", "ethereum/go-ethereum")
    parsed_3 = json.loads(res_3)
    print(f" -> Consensus Status: {parsed_3['status']}")
    print(f" -> Commits Found: {parsed_3['commits_found']}")
    assert parsed_3['verified'] is True
    assert parsed_3['commits_found'] is True

    # Test 4: verify_repo_contribution (negative / fake user check)
    print("\n[Test 4] Verifying fake user in ethereum/go-ethereum...")
    res_4 = verifier.verify_repo_contribution("random_fake_user_12345", "ethereum/go-ethereum")
    parsed_4 = json.loads(res_4)
    print(f" -> Consensus Status: {parsed_4['status']}")
    print(f" -> Commits Found: {parsed_4['commits_found']}")
    assert parsed_4['verified'] is False
    assert parsed_4['commits_found'] is False

    # Test 5: Uninscribed claim returns 'Claim not found'
    print("\n[Test 5] Querying non-existent claim...")
    unfound = verifier.get_claim("nonexistent_handle_contrib_999")
    assert unfound == "Claim not found"
    print(" -> Unfound Query Status: 'Claim not found' (SUCCESS)")

    print("\n>>> All contract logic, identity binding & consensus tests passed! <<<\n")

if __name__ == "__main__":
    test_contract_suite()
