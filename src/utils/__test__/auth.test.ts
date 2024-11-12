import { describe, it, expect, beforeEach } from 'vitest'
import { getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjZjMzRlMWFmYzJlMWExZjk2YmJhMiIsImVtYWlsIjoieHVhbnRydW9uZzIwMDEwMUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTIxVDA5OjQ5OjM2LjM2OFoiLCJpYXQiOjE2OTI2MTEzNzYsImV4cCI6MTY5MjYxMTM4Nn0.F-ksv9-QMKQkUp2jlPv4Vd6o_gHXGIUQhmImSgc4IQ8'
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjZjMzRlMWFmYzJlMWExZjk2YmJhMiIsImVtYWlsIjoieHVhbnRydW9uZzIwMDEwMUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIzLTA4LTIxVDA5OjQ5OjM2LjM2OFoiLCJpYXQiOjE2OTI2MTEzNzYsImV4cCI6MTY5MjYxNDk3Nn0.FUBm8WvsScernZyR4WRX50kO84Y-WoTdEaIWhmaKtbY'

beforeEach(() => {
  localStorage.clear()
})

describe('setAccessTokenToLS', () => {
  it('access token duoc set vao local storage', () => {
    setAccessTokenToLS(access_token)
    expect(localStorage.getItem('access_token')).toEqual(access_token)
  })
})

describe('setRefreshTokenToLS', () => {
  it('refresh token da duoc set vao local storage ', () => {
    setRefreshTokenToLS(refresh_token)
    expect(localStorage.getItem('refresh_token')).toEqual(refresh_token)
  })
})

describe('getAccessTokenFromLS', () => {
  it('getAccessTokenFromLS', () => {
    setAccessTokenToLS(access_token)
    expect(getAccessTokenFromLS()).toEqual(access_token)
  })
})

describe('getRefreshTokenFromLS', () => {
  it('getRefreshTokenFromLS', () => {
    setRefreshTokenToLS(refresh_token)
    expect(getRefreshTokenFromLS()).toEqual(refresh_token)
  })
})
