import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { TAURI_ORG_NAME } from './constants'

export async function getIssueFromUrl(
  octokit: Octokit,
  url: string
): Promise<
  RestEndpointMethodTypes['issues']['get']['response']['data'] | undefined
> {
  const matches = /\.github\.com\/(.+?)\/(.+?)\/issues\/([0-9]+)$/.exec(url)
  if (!matches) return

  const [, owner, repo, issue_number] = matches

  if (!+issue_number) return

  return (
    await octokit.issues.get({ issue_number: +issue_number, owner, repo })
  ).data
}

export async function isTauriOrgMemeber(
  octokit: Octokit,
  user: string
): Promise<boolean> {
  return (await octokit.orgs.listMembers({ org: TAURI_ORG_NAME })).data
    .map((u) => u.login)
    .includes(user)
}