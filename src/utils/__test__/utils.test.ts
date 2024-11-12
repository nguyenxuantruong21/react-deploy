import { describe, it, expect } from 'vitest'
import { formatEmailShowUI, isAxiosError, isAxiosErrorUnprocessableEntity } from '../utils'
import { AxiosError } from 'axios'

describe('isAxiosError', () => {
  it('isAxiosError', () => {
    expect(isAxiosError(new Error())).toBe(false)
    expect(isAxiosError(new AxiosError())).toBe(true)
  })
})

describe('isAxiosErrorUnprocessableEntity', () => {
  it('isAxiosErrorUnprocessableEntity', () => {
    expect(isAxiosErrorUnprocessableEntity(new Error())).toEqual(false)
    expect(
      isAxiosErrorUnprocessableEntity(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: 422,
          data: null,
        } as any),
      ),
    ).toBe(true)
  })
})

describe('formatEmail', () => {
  it('format email', () => {
    expect(formatEmailShowUI('xuantruongdev@gmail.com')).toBe('xuantruongdev')
  })
})
