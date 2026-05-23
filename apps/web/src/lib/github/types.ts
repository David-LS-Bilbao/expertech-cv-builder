export interface GitHubProfile {
  id: number
  login: string
  name: string
  avatarUrl: string
  bio: string
  profileUrl: string
  company: string
  blog: string
  location: string
  publicRepos: number
  followers: number
  following: number
}

export interface GitHubRepository {
  id: number
  name: string
  fullName: string
  description: string
  repositoryUrl: string
  homepageUrl: string
  language: string
  ownerLogin: string
  ownerType: string
  stars: number
  forks: number
  updatedAt: string
  isFork: boolean
  isArchived: boolean
  isPrivate: boolean
}

export interface GitHubPublicData {
  username: string
  profile: GitHubProfile
  repositories: GitHubRepository[]
  excludedForks: number
}
