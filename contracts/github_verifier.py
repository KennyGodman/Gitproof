# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json

class GitHubActivityVerifier(gl.Contract):
    claims: TreeMap[str, str]

    def __init__(self):
        self.claims = TreeMap()

    def _get_sender(self) -> str:
        return str(getattr(gl.message, "sender_address", getattr(gl.message, "sender", "0x0000000000000000000000000000000000000000")))

    @gl.public.write
    def verify_contribution_count(self, github_handle: str, min_contributions: str) -> str:
        handle = github_handle.strip().lstrip('@')
        sender = self._get_sender()
        claim_id = f"{handle}_contrib_{min_contributions}"
        bound_id = f"{sender}:{claim_id}"

        def evaluate():
            profile_url = f"https://github.com/{handle}"
            web_data = gl.nondet.web.render(profile_url, mode='html')
            prompt = f"""
            You are a decentralized validator adjudicating whether GitHub user '{handle}' has at least {min_contributions} contributions in the past year.
            Claimant Address: {sender}
            
            GitHub Profile HTML:
            {web_data[:10000]}
            
            Instructions:
            1. Search the HTML for contribution numbers (e.g. 'contributions in the last year' or calendar matrix).
            2. If detected contributions >= {min_contributions}, return verified=true and status='VERIFIED'.
            3. If detected contributions < {min_contributions}, user not found, or profile is missing, return verified=false and status='REJECTED'.
            
            Return valid JSON adhering to schema:
            {{"verified": true, "detected": 500, "status": "VERIFIED", "reason": "substantiated reasoning", "sender": "{sender}"}}
            """
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_non_comparative(
            task=evaluate,
            criteria="Result must be a valid JSON with verified boolean, detected number, and reason."
        )

        # Inscribe both canonical handle claim and cryptographically bound identity claim
        self.claims[claim_id] = result
        self.claims[bound_id] = result
        return result

    @gl.public.write
    def verify_repo_contribution(self, github_handle: str, repo: str) -> str:
        handle = github_handle.strip().lstrip('@')
        clean_repo = repo.strip().strip('/')
        sender = self._get_sender()
        claim_id = f"{handle}_repo_{clean_repo.replace('/', '_')}"
        bound_id = f"{sender}:{claim_id}"

        def evaluate():
            commits_url = f"https://github.com/{clean_repo}/commits?author={handle}"
            commits_page = gl.nondet.web.render(commits_url, mode='html')
            prompt = f"""
            You are a decentralized validator verifying if GitHub user '{handle}' has authored commits in repository '{clean_repo}'.
            Claimant Address: {sender}
            
            Commits HTML:
            {commits_page[:10000]}
            
            Instructions:
            1. Check if the commits page contains authored commits for author '{handle}'.
            2. If active commits authored by '{handle}' are found, return verified=true, commits_found=true, and status='VERIFIED'.
            3. If 'No commits found', blankslate, 404, or no matching author commits are present, return verified=false, commits_found=false, and status='REJECTED'.
            
            Return valid JSON adhering to schema:
            {{"verified": true, "commits_found": true, "status": "VERIFIED", "reason": "substantiated reasoning", "sender": "{sender}"}}
            """
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_non_comparative(
            task=evaluate,
            criteria="Result must be a valid JSON with verified boolean, commits_found boolean, and reason."
        )

        # Inscribe both canonical handle claim and cryptographically bound identity claim
        self.claims[claim_id] = result
        self.claims[bound_id] = result
        return result

    @gl.public.view
    def get_claim(self, claim_id: str) -> str:
        return self.claims.get(claim_id, "Claim not found")
