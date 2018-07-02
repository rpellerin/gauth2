import StorageService from 'utils/storageService'
import { notify } from 'utils/notifications'
import { getAccounts, persitStateToLocalStorage } from 'reducers/accounts'

/**
 * Action creators
 */
export const setEncryptionStatus = payload => ({
  type: 'SET_ENCRYPTION_STATUS',
  payload
})

/**
 * Middleware
 */
export const encryptionMiddleware = store => next => async action => {
  const ret = next(action)
  if (action.type === 'SET_ENCRYPTION_STATUS' && StorageService.isSupported()) {
    notify(`Encryption successfully ${action.payload ? 'enabled' : 'disabled'}`)
    const state = store.getState()
    await persitStateToLocalStorage(
      getAccounts(state),
      isEncrypted(state),
      getPassword(state)
    )
  }
  return ret // Do not interrupt the chain
}

/**
 * Selector
 */
export const isEncrypted = state => state.encryption.isEncrypted
export const getPassword = state => state.encryption.password

/**
 * Reducer
 */
const reducer = (state = { isEncrypted: false, password: null }, action) => {
  switch (action.type) {
    case 'SET_ENCRYPTION_STATUS':
      return {
        isEncrypted: action.payload.enabled,
        password: action.payload.password
      }
    default:
      return state
  }
}

export default reducer
