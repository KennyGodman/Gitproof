# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json

class GitHubActivityVerifier(gl.Contract):
    claims: TreeMap[str, str]

    def __init__(self):
        self.claims = TreeMap()

    @gl.public.write
    def verify_contribution_count(self, github_handle: str, min_contributions: str) -> str:
        handle = github_handle.strip().lstrip('@')
        claim_id = f"{handle}_contrib_{min_contributions}"

        def evaluate():
            profile_url = f"https://github.com/{handle}"
            web_data = gl.nondet.web.render(profile_url, mode='html')
            prompt = f"""
            You are a validator verifying if GitHub user '{handle}' has at least {min_contributions} contributions in the past year.
            GitHub Profile HTML:
            {web_data[:10000]}
            
            Return a JSON object:
            {{"verified": true, "detected": 500, "status": "VERIFIED", "reason": "found contributions"}}
            """
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_non_comparative(
            evaluate,
            criteria="Result must be a valid JSON with verified boolean and reason."
        )
        self.claims[claim_id] = result
        return result

    @gl.public.write
    def verify_repo_contribution(self, github_handle: str, repo: str) -> str:
        handle = github_handle.strip().lstrip('@')
        clean_repo = repo.strip().strip('/')
        claim_id = f"{handle}_repo_{clean_repo.replace('/', '_')}"

        def evaluate():
            commits_url = f"https://github.com/{clean_repo}/commits?author={handle}"
            commits_page = gl.nondet.web.render(commits_url, mode='html')
            prompt = f"""
            Verify if GitHub user '{handle}' has authored commits in repository '{clean_repo}'.
            Commits HTML:
            {commits_page[:10000]}
            
            Return a JSON object:
            {{"verified": true, "commits_found": true, "status": "VERIFIED", "reason": "commits present"}}
            """
            return gl.nondet.exec_prompt(prompt)

        result = gl.eq_principle.prompt_non_comparative(
            evaluate,
            criteria="Result must be a valid JSON with verified boolean and reason."
        )
        self.claims[claim_id] = result
        return result

    @gl.public.view
    def get_claim(self, claim_id: str) -> str:
        return self.claims.get(claim_id, "Claim not found")



