import { enableFetchMocks } from 'jest-fetch-mock'
import store from '../store'
import { clearUserInfo } from '../store/user/user'

enableFetchMocks()

describe('formPost', () => {
  describe('when we are authenticated', () => {

  })
  describe('when we are not authenticated', () => {
    beforeEach(() => store.dispatch(clearUserInfo()))

    test.todo('it works')
  })
})
