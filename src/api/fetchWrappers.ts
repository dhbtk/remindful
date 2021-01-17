import store from '../store'
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const baseUrl: string = process.env.API_URL || 'https://localhost'

function headers(): Record<string, string> {
  const token = store.getState().user.user.accessToken

  if (token === null) {
    return {};
  } else {
    return {Authorization: `Bearer ${token}`};
  }
}

function handleStatus(response: Response): Promise<any> {
  if (response.ok) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(response);
  }
}

function toJson(response: Response): Promise<any> {
  return response.json().then(obj => camelcaseKeys(obj, {deep: true}));
}

function handleError(...args: any[]): Promise<any> {
  console.log(...args)
  return Promise.reject(...args)
}

export function formPost<T>(path: string, body: any): Promise<T> {
  const formData = new URLSearchParams(snakecaseKeys(body) as any);

  return fetch(url(path), {
    method: 'POST',
    headers: headers(),
    body: formData
  }).then(handleStatus).then(toJson).catch(handleError)
}

export function apiGet<T>(path: string, query: any): Promise<T> {
  const formData = new URLSearchParams(snakecaseKeys(query) as any);

  return fetch(`${url(path)}?${formData}`, {
    method: 'GET',
    headers: headers()
  }).then(handleStatus).then(toJson).catch(handleError)
}

function jsonBody(method: string) {
  return function <T>(path: string, body: any): Promise<T> {
    return fetch(url(path), {
      method,
      headers: headers(),
      body: JSON.stringify(snakecaseKeys(body))
    }).then(handleStatus).then(toJson);
  }
}

const url = (path: string): string => `${baseUrl}${path}`

export const apiPost = jsonBody('POST');
export const apiPatch = jsonBody('PATCH');
export const apiDelete = jsonBody('DELETE');
