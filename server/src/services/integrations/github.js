import { env } from '../../config/env.js';

class GitHubService {
  isConfigured() {
    return Boolean(env.githubToken);
  }

  async listRepos() {
    if (!this.isConfigured()) {
      return { configured: false, repos: [] };
    }

    const username = env.githubUsername || 'me';
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        Authorization: `Bearer ${env.githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    return {
      configured: true,
      repos: repos.map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
      })),
    };
  }

  async getRepo(owner, repo) {
    if (!this.isConfigured()) {
      throw new Error('GITHUB_TOKEN non configurato');
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${env.githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }
}

export const githubService = new GitHubService();
