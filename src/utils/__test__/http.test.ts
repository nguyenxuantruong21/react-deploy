import { describe, it, expect, beforeEach } from 'vitest'
import http from '../http'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

describe('http axios', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  const access_token_1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjZjMzRlMWFmYzJlMWExZjk2YmJhMiIsImVtYWlsIjoieHVhbnRydW9uZzIwMDEwMUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTIyVDAwOjM1OjA5LjUwMloiLCJpYXQiOjE2OTI2NjQ1MDksImV4cCI6MTY5MjY2NDUxMH0.FTqxk6teI7yhvK4C1KNl7Zt7LGjbaqHACH9ckUqVV-s'
  const refresh_token_1000_day =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjZjMzRlMWFmYzJlMWExZjk2YmJhMiIsImVtYWlsIjoieHVhbnRydW9uZzIwMDEwMUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTIyVDAwOjM1OjA5LjUwMloiLCJpYXQiOjE2OTI2NjQ1MDksImV4cCI6MTY5MzUyODUwOX0.6geaNp8XsWMxgviayp1UTFP-LNEfYabJ1tdBR8LBLI4'

  it('call api', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('auth request', async () => {
    // nen co account test
    await http.post('login', {
      email: 'xuantruong200101@gmail.com',
      password: '18102001',
    })
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('refresh token', async () => {
    setAccessTokenToLS(access_token_1s)
    setRefreshTokenToLS(refresh_token_1000_day)
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
