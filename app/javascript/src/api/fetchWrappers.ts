import store from '../store'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import { resetState } from '../store/common/commonActions'

export interface ErrorResponse {
  errors: ApiError[]
}

export interface ApiError {
  attribute: string
  type: string
  options: any
}

export interface SuccessResponse<T> {
  status: 200 | 201
  successBody: T
}

export interface BlankResponse {
  status: 204
}

export interface FailedResponse {
  status: number
  errorBody: ErrorResponse
}

export type ResponseWrapper<T> = SuccessResponse<T> | FailedResponse | BlankResponse

export function isSuccessResponse<T> (response: ResponseWrapper<T>): response is SuccessResponse<T> {
  return response.status === 200 || response.status === 201
}

export function isFailedResponse<T> (response: ResponseWrapper<T>): response is FailedResponse {
  return response.status === 422
}

export function unwrap<T> (response: ResponseWrapper<T>): T {
  if (isSuccessResponse(response)) {
    return response.successBody
  } else if (response.status === 204) {
    return undefined as unknown as T
  }
  throw new Error('Unsuccessful response')
}

function headers (): Record<string, string> {
  const token = store.getState().user.accessToken

  if (token === null) {
    return {}
  } else {
    return { Authorization: `Bearer ${token}` }
  }
}

export interface FetchError extends Error {
  response: Response
}

export function isFetchError (error: Error): error is FetchError {
  return 'response' in error
}

async function handleStatus (response: Response): Promise<Response> {
  if (response.ok || response.status === 422) {
    return response
  } else {
    console.error(response)
    if (response.status === 401) {
      store.dispatch(resetState())
    }
    const error: FetchError = new Error(response.status.toString()) as FetchError
    error.response = response
    throw error
  }
}

async function toJson<T> (response: Response): Promise<ResponseWrapper<T>> {
  if (response.status === 204) {
    return { status: 204 }
  }
  const body = await response.json().then(obj => camelcaseKeys(obj, { deep: true }))
  if (response.status === 200) {
    return { status: response.status, successBody: body }
  } else {
    return { status: response.status, errorBody: body }
  }
}

export async function formPost<T> (path: string, body: Record<string, string>): Promise<ResponseWrapper<T>> {
  const formData = new URLSearchParams(snakecaseKeys(body))
  const response = await fetch(path, {
    method: 'POST',
    headers: headers(),
    body: formData
  }).then(handleStatus)

  return await toJson(response)
}

export async function apiGet<T> (path: string, query: Record<string, string | string[] | number> = {}): Promise<ResponseWrapper<T>> {
  const formData = new URLSearchParams()
  const snakecased = snakecaseKeys(query)
  Object.keys(snakecased).forEach(key => {
    if (typeof snakecased[key] === 'string') {
      formData.append(key, snakecased[key])
    } else {
      snakecased[key].forEach((value: string) => {
        formData.append(`${key}[]`, value)
      })
    }
  })

  const response = await fetch(`${path}?${formData.toString()}`, {
    method: 'GET',
    headers: headers()
  }).then(handleStatus)

  return await toJson(response)
}

function jsonBody (method: string) {
  return async function <T> (path: string, body: any = {}): Promise<ResponseWrapper<T>> {
    const response = await fetch(path, {
      method,
      headers: { ...headers(), 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(snakecaseKeys(body))
    }).then(handleStatus)
    return await toJson(response)
  }
}

export const apiPost = jsonBody('POST')
export const apiPatch = jsonBody('PATCH')
export const apiDelete = jsonBody('DELETE')
