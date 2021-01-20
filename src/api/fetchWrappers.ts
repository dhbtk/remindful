import store from '../store'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import { clearUserInfo } from '../store/user'

const baseUrl: string = process.env.API_URL ?? 'https://localhost'

function headers (): Record<string, string> {
  const token = store.getState().user.user.accessToken

  if (token === null) {
    return {}
  } else {
    return { Authorization: `Bearer ${token}` }
  }
}

async function handleStatus (response: Response): Promise<any> {
  if (response.ok) {
    return response
  } else {
    console.error(response)
    if (response.status === 401) {
      store.dispatch(clearUserInfo())
    }
    throw new Error(response.status.toString())
  }
}

async function toJson (response: Response): Promise<any> {
  if (response.status === 204) {
    return await Promise.resolve()
  }
  return await response.json().then(obj => camelcaseKeys(obj, { deep: true }))
}

export async function formPost<T> (path: string, body: Record<string, string>): Promise<T> {
  const formData = new URLSearchParams(snakecaseKeys(body))

  return await fetch(url(path), {
    method: 'POST',
    headers: headers(),
    body: formData
  }).then(handleStatus).then(toJson)
}

export async function apiGet<T> (path: string, query: Record<string, string>): Promise<T> {
  const formData = new URLSearchParams(snakecaseKeys(query))

  return await fetch(`${url(path)}?${formData.toString()}`, {
    method: 'GET',
    headers: headers()
  }).then(handleStatus).then(toJson)
}

function jsonBody (method: string) {
  return async function <T>(path: string, body: any): Promise<T> {
    return await fetch(url(path), {
      method,
      headers: { ...headers(), 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(snakecaseKeys(body))
    }).then(handleStatus).then(toJson)
  }
}

const url = (path: string): string => `${baseUrl}${path}`

export const apiPost = jsonBody('POST')
export const apiPatch = jsonBody('PATCH')
export const apiDelete = jsonBody('DELETE')
