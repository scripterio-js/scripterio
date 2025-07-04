import {
  describe,
  test,
  expect,
  request,
  beforeEach,
  afterAll,
} from '../src/index.mjs'

const BASE_ENDPOINT = 'https://api.restful-api.dev/objects'
let preparedData

const cleanData = async (id) => {
  return await request.delete(`${BASE_ENDPOINT}/${id}`)
}

const createData = async () => {
  const product = {
    name: 'Apple MacBook Pro 2020',
    data: {
      year: 2020,
      price: 1999.99,
      'CPU model': 'M1 pro',
      'Hard disk size': '1 TB',
      color: 'space gray',
    },
  }

  const response = await request.post(BASE_ENDPOINT, product)
  return await response.json()
}

describe('Unit tests for request', () => {
  beforeEach(async () => {
    if (preparedData) await cleanData(preparedData.id)
    preparedData = await createData()
  })

  afterAll(async () => {
    if (preparedData) await cleanData(preparedData.id)
  })

  test('Check get() method to get single object', async () => {
    const response = await request.get(`${BASE_ENDPOINT}/${preparedData.id}`)
    expect(response.status).toBeEqual(200)
  })

  test('Check get() method to get all objects', async () => {
    const response = await request.get(BASE_ENDPOINT)
    const data = await response.json()
    expect(response.status).toBeEqual(200)
    expect(data.length).toBeGreaterThan(1)
  })

  test('Check put() method to update single object', async () => {
    const product = {
      name: 'Apple MacBook Pro 2021',
      data: {
        year: 2021,
        price: 1999.99,
        'CPU model': 'M2 pro',
        'Hard disk size': '1 TB',
        color: 'silver',
      },
    }
    const response = await request.put(
      `${BASE_ENDPOINT}/${preparedData.id}`,
      product
    )
    const data = await response.json()
    expect(response.status).toBeEqual(200)
    expect(data.updatedAt).toBeDefined()
    expect(data.id).toBeEqual(preparedData.id)
    expect(data.name).toBeEqual(product.name)
  })

  test('Check patch() method to update single object', async () => {
    const product = {
      name: 'Apple MacBook Air',
    }
    const response = await request.patch(
      `${BASE_ENDPOINT}/${preparedData.id}`,
      product
    )
    const data = await response.json()
    expect(response.status).toBeEqual(200)
    expect(data.updatedAt).toBeDefined()
    expect(data.id).toBeEqual(preparedData.id)
    expect(data.name).toBeEqual(product.name)
  })
})
