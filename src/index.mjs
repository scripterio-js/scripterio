import * as core from './core/context.mjs'
import { expect as coreExpect } from './core/expect.mjs'
import * as requestCore from './core/request.mjs'

/**
 * Describe a "suite" with the given title and callback fn containing nested suites.
 *
 * **Usage**
 *
 * ```js
 * describe('Unit tests for assertions', () => {
 *  test('Check assertion toBeDefined()', () => {
 *    const number = 1
 *    expect(number).toBeDefined()
 *  })
 * })
 * ```
 *
 * @param name Group title.
 * @param optionsOrBody (Optional) Object with options
 * @param callback A callback that is run immediately when calling describe(name, optionsOrBody, callback)
 */
export const describe = (name, optionsOrBody, body) =>
  core.describe(name, optionsOrBody, body)

/**
 * Declares a skipped test group.
 * Tests in the skipped group are never run.
 * - `describe.skip(title)`
 * - `describe.skip(title, details, callback)`
 *
 * **Usage**
 *
 * ```js
 * describe.skip('skipped group', () => {
 *   test('example', () => {
 *     // This test will not run
 *   });
 * });
 * ```
 *
 * @param name Test title.
 * @param optionsOrBody (Optional) Object with options
 * @param callback A callback that is run immediately when calling test(name, optionsOrBody, callback)
 */
describe.skip = (name) => core.skip(name)

/**
 * Test a specification or test-case with the given title, test options and callback fn.
 *
 * **Usage**
 *
 * ```js
 * test('Check assertion toBeDefined()', () => {
 *    const number = 1
 *    expect(number).toBeDefined()
 * })
 * ```
 *
 * @param name Test title.
 * @param optionsOrBody (Optional) Object with options
 * @param callback A callback that is run immediately when calling test(name, optionsOrBody, callback)
 */
export const test = (name, optionsOrBody, body) =>
  core.test(name, optionsOrBody, body)

/**
 * Declares a skipped test.
 * Test is never run.
 * - `test.skip(title, callback)`
 *
 * **Usage**
 *
 * ```js
 * describe('example', () => {
 *   test.skip('skipped test', () => {
 *     // This test will not run
 *   });
 * });
 * ```
 *
 * @param name Test title.
 * @param optionsOrBody (Optional) Object with options
 * @param callback A callback that is run immediately when calling test(name, optionsOrBody, callback)
 */
test.skip = (name) => core.skip(name)

/**
 * Execute before each test case.
 *
 * **Usage**
 *
 * ```js
 * beforeEach(() => {
 *  const number = 1
 * });
 * ```
 */
export const beforeEach = (body) => core.beforeEach(body)

/**
 * Execute before all test cases.
 *
 * **Usage**
 *
 * ```js
 * beforeAll(() => {
 *  const number = 1
 * });
 * ```
 */
export const beforeAll = (body) => core.beforeAll(body)

/**
 * Execute after each test case.
 *
 * **Usage**
 *
 * ```js
 * afterEach(() => {
 *  const number = 1
 * });
 * ```
 */
export const afterEach = (body) => core.afterEach(body)

/**
 * Execute after all test cases.
 *
 * **Usage**
 *
 * ```js
 * afterAll(() => {
 *  const number = 1
 * });
 * ```
 */
export const afterAll = (body) => core.afterAll(body)

/**
 * @typedef {Object} Assertions
 * @property {Function} toBeDefined - Check that a variable is not undefined.
 * @property {Function} toBeUndefined - Check that a variable is undefined.
 * @property {Function} toBeEqual - Compare values for deep equality.
 * @property {Function} toBeNotEqual - Compare values for deep inequality.
 * @property {Function} toBeFalsy - Check that a variable is Falsy.
 * @property {Function} toBeTruthy - Check that a variable is Truthy.
 * @property {Function} toBeNull - Check that a variable is Null.
 * @property {Function} toBeNotNull - Check that a variable is not Null.
 * @property {Function} toHaveLength - Check that an object has a .length property and it matches a number.
 * @property {Function} toBeNaN - Check that a variable is NaN.
 * @property {Function} toBeGreaterThan - Compare two numbers (received > expected).
 * @property {Function} toBeLessThan - Compare two numbers (received < expected).
 * @property {Function} toContain - Check that an item is in an array or a string contains a substring.
 * @property {Function} toMatch - Check that a string matches a regular expression.
 */

/**
 * Expect gives you access to a number of "matchers" that let you validate different things.
 *
 * **Usage**
 *
 * ```js
 *  expect(number).toBeDefined()
 * ```
 *
 * @param {any} value - the value to be tested.
 * @returns {Assertions} test functions that let you validate different things
 */
export const expect = (expected) => coreExpect(expected)

/**
 * Represents the response object from a fetch request.
 * This object contains the response data and utility methods to handle the response.
 *
 * @typedef {Object} Response
 * @property {boolean} ok - Boolean indicating if the response was successful (status in the range 200-299)
 * @property {number} status - The status code of the response (e.g., 200 for success, 404 for not found)
 * @property {string} statusText - The status message associated with the status code
 * @property {boolean} redirected - Indicates whether or not the response is the result of a redirect
 * @property {string} type - The type of the response (e.g., 'basic', 'cors', 'error')
 * @property {string} url - The URL of the response
 * @property {Headers} headers - The headers associated with the response
 * @property {boolean} bodyUsed - Indicates whether the body has been read yet
 * @property {Function} arrayBuffer - Returns a promise that resolves with an ArrayBuffer representation of the body
 * @property {Function} blob - Returns a promise that resolves with a Blob representation of the body
 * @property {Function} formData - Returns a promise that resolves with a FormData representation of the body
 * @property {Function} json - Returns a promise that resolves with the result of parsing the body text as JSON
 * @property {Function} text - Returns a promise that resolves with the body text
 * @property {Function} clone - Creates a clone of the response object
 */

/**
 * HTTP client for making API requests
 *
 * **Usage**
 * ```js
 * // GET request
 * const users = await request.get('https://api.example.com/users')
 *
 * // POST request
 * const newUser = await request.post('https://api.example.com/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 *
 * // PUT request
 * const updatedUser = await request.put('https://api.example.com/users/1', {
 *   name: 'John Updated'
 * })
 *
 * // PATCH request
 * const patchedUser = await request.patch('https://api.example.com/users/1', {
 *   name: 'John Patched'
 * })
 *
 * // DELETE request
 * await request.delete('https://api.example.com/users/1')
 * ```
 * @namespace request
 * @property {Function} get - Send a GET request that returns a {@link Response}
 * @property {Function} post - Send a POST request with JSON body that returns a {@link Response}
 * @property {Function} put - Send a PUT request with JSON body that returns a {@link Response}
 * @property {Function} patch - Send a PATCH request with JSON body that returns a {@link Response}
 * @property {Function} delete - Send a DELETE request that returns a {@link Response}
 */
export const request = () => {}

/**
 * Sends a GET request to the specified URL and returns a Response object.
 * The Response object contains data and utility methods to handle the response.
 *
 * @param {string} url - The URL to send the GET request to
 * @param {RequestInit} [config] - Optional request configuration
 * @returns {Promise<Response>} A promise that resolves to a {@link Response} object with:
 * - ok: boolean - Indicates if the response was successful (status in 200-299 range)
 * - status: number - HTTP status code (e.g. 200 for success)
 * - statusText: string - Status message (e.g. "OK" for 200)
 * - headers: Headers - Response headers
 * - json(): Promise<any> - Parse response body as JSON
 * - text(): Promise<string> - Get response body as text
 * - blob(): Promise<Blob> - Get response as Blob
 * @example
 * // Simple GET request with response handling
 * const response = await request.get('https://api.example.com/users/1');
 * if (response.ok) {
 *   const data = await response.json();
 *   console.log(data);
 * }
 *
 * // GET request with custom headers
 * const response = await request.get('https://api.example.com/users/1', {
 *   headers: {
 *     'Authorization': 'Bearer token123'
 *   }
 * });
 */
request.get = (url, config) => requestCore.get(url, config)

/**
 * Sends a POST request to the specified URL
 * @param {string} url - The URL to send the POST request to
 * @param {any} body - The request body
 * @param {RequestInit} [config] - Optional request configuration
 * @returns {Promise<Response>} The fetch response
 * @example
 * // Create a new user
 * const newUser = await post('https://api.example.com/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 *
 * // Post with custom headers
 * const response = await post('https://api.example.com/posts',
 *   { title: 'New Post', content: 'Content...' },
 *   { headers: { 'Authorization': 'Bearer token123' } }
 * )
 */
request.post = (url, body, config) => requestCore.post(url, body, config)

/**
 * Sends a PUT request to the specified URL
 * @param {string} url - The URL to send the PUT request to
 * @param {any} body - The request body
 * @param {RequestInit} [config] - Optional request configuration
 * @returns {Promise<Response>} The fetch response
 * @example
 * // Update a user
 * const updatedUser = await put('https://api.example.com/users/1', {
 *   name: 'John Updated',
 *   email: 'john.updated@example.com'
 * })
 *
 * // Put with custom cache option
 * const response = await put('https://api.example.com/posts/1',
 *   { title: 'Updated Post', content: 'Updated content...' },
 *   { cache: 'no-cache' }
 * )
 */
request.put = (url, body, config) => requestCore.put(url, body, config)

/**
 * Sends a PATCH request to the specified URL
 * @param {string} url - The URL to send the PATCH request to
 * @param {any} body - The request body
 * @param {RequestInit} [config] - Optional request configuration
 * @returns {Promise<Response>} The fetch response
 * @example
 * // Partially update a user
 * const patchedUser = await patch('https://api.example.com/users/1', {
 *   name: 'John Patched'
 * })
 *
 * // Patch with custom headers
 * const response = await patch('https://api.example.com/posts/1',
 *   { title: 'Patched Title' },
 *   { headers: { 'If-Match': 'etag123' } }
 * )
 */
request.patch = (url, body, config) => requestCore.patch(url, body, config)

/**
 * Sends a DELETE request to the specified URL
 * @param {string} url - The URL to send the DELETE request to
 * @param {RequestInit} [config] - Optional request configuration
 * @returns {Promise<Response>} The fetch response
 * @example
 * // Simple DELETE request
 * await del('https://api.example.com/users/1')
 *
 * // DELETE with custom configuration
 * await del('https://api.example.com/posts/1', {
 *   headers: {
 *     'Authorization': 'Bearer token123',
 *     'If-Match': 'etag123'
 *   }
 * })
 */
request.delate = (url, config) => requestCore.del(url, config)
