import fetchMock, { enableFetchMocks } from "jest-fetch-mock"
import { get, def } from 'bdd-lazy-var'
import store from "../store";
import { setUserInfo, clearUserInfo } from '../store/user'

enableFetchMocks()

describe('formPost', () => {
  describe('when we are authenticated', () => {

  })
  describe('when we are not authenticated', () => {
    beforeEach(() => store.dispatch(clearUserInfo()))

    it('')
  })
})
