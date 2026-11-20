'use client'
import { useField, useForm } from '@payloadcms/ui'
import { useEffect, useState, type ChangeEvent } from 'react'

interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
}

export default function GithubRepoSelect({ path }: { readonly path: string }) {
  const { value, setValue } = useField<string>({ path })
  const { dispatchFields } = useForm()
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/projects/repositories')
      .then((res) => res.json())
      .then((data: { repos?: GithubRepo[]; error?: string }) => {
        if (data.repos) setRepos(data.repos)
        else if (data.error) setError(data.error)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = event.target.value
    setValue(selected)
    if (!selected) return

    const repo = repos.find((item) => item.full_name === selected)
    if (!repo) return

    dispatchFields({ type: 'UPDATE', path: 'title', value: repo.name })
    dispatchFields({ type: 'UPDATE', path: 'repositoryUrl', value: repo.html_url })
    dispatchFields({ type: 'UPDATE', path: 'projectType', value: repo.private ? 'private' : 'public' })
    if (repo.description) {
      dispatchFields({ type: 'UPDATE', path: 'description', value: repo.description })
    }
  }

  return (
    <div className="field-type select" style={{ marginBottom: '20px' }}>
      <label className="field-label" htmlFor="github-repository">
        GitHub Repository
      </label>

      {loading && <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>Loading repositories...</div>}
      {error && (
        <div style={{ fontSize: '13px', color: 'var(--theme-error-400)', marginTop: '5px' }}>Error: {error}</div>
      )}

      {!loading && !error && (
        <select
          id="github-repository"
          className="field-type select"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-150)',
            backgroundColor: 'var(--theme-elevation-50)',
            color: 'var(--theme-elevation-800)',
            marginTop: '8px',
          }}
          value={value}
          onChange={handleChange}
        >
          <option value="">-- Select a GitHub Repository --</option>
          {repos.map((repo) => (
            <option key={repo.id} value={repo.full_name}>
              {repo.full_name} {repo.private ? '(Private)' : ''}
            </option>
          ))}
        </select>
      )}
      <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
        Selecting a repository will auto-fill the title, repository URL, project type, and description.
      </div>
    </div>
  )
}
