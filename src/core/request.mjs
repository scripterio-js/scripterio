/* eslint-disable no-undef */

/**
 * Default request configuration that will be used for all requests
 * @type {RequestInit}
 */
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  credentials: 'same-origin',
  cache: 'default',
  redirect: 'follow',
  referrerPolicy: 'strict-origin-when-cross-origin',
}

/**
 * Creates a fetch request with merged configuration
 * @param {string} url - The URL to send the request to
 * @param {RequestInit} [config] - Custom request configuration
 * @returns {Promise<Response>} The fetch response
 * @private
 */
const createRequest = async (url, config = {}) => {
  const finalConfig = {
    ...defaultConfig,
    ...config,
    headers: {
      ...defaultConfig.headers,
      ...(config.headers || {}),
    },
  }

  const response = await fetch(url, finalConfig)
  const responseData = await response
    .clone()
    .json()
    .catch(() => null)

  if (global.currentTest) {
    global.currentTest.apiDetails = global.currentTest.apiDetails || []
    global.currentTest.apiDetails.push({
      request: {
        url,
        method: finalConfig.method,
        headers: finalConfig.headers,
        body: finalConfig.body ? JSON.parse(finalConfig.body) : null,
      },
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
      },
    })
  }

  return response
}

export const get = async (url, config = {}) => {
  return createRequest(url, {
    ...config,
    method: 'GET',
  })
}

export const post = async (url, body, config = {}) => {
  return createRequest(url, {
    ...config,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const put = async (url, body, config = {}) => {
  return createRequest(url, {
    ...config,
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export const patch = async (url, body, config = {}) => {
  return createRequest(url, {
    ...config,
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export const del = async (url, config = {}) => {
  return createRequest(url, {
    ...config,
    method: 'DELETE',
  })
}
