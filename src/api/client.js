import http from './http'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export function useMockData() {
  return useMock
}

/** 接真实接口时把 mock 分支删掉，只保留 request 即可 */
export function requestOrMock(mockFactory, request) {
  if (useMock) {
    return Promise.resolve(typeof mockFactory === 'function' ? mockFactory() : mockFactory)
  }
  return request(http)
}
