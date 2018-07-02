import StorageService from 'utils/storageService'
import * as KeyUtilities from 'utils/keyUtilities'
import { encryptText } from 'utils/WebCrypto'
import { notify } from 'utils/notifications'
import { isEncrypted, getPassword } from 'reducers/encryption'

/**
 * Action creators
 */
export const addAccount = payload => ({
  type: 'ADD_ACCOUNT',
  payload
})
export const addAccounts = payload => ({
  type: 'ADD_ACCOUNTS',
  payload
})
export const updateAccount = payload => ({
  type: 'UPDATE_ACCOUNT',
  payload
})
export const deleteAccount = payload => ({
  type: 'DELETE_ACCOUNT',
  payload
})
export const refreshOTPs = () => ({
  type: 'REFRESH_OTPS'
})

export const persitStateToLocalStorage = async (
  _accounts,
  isEncrypted,
  password
) => {
  const accs = _accounts.map(({ otp, ...rest }) => rest)
  const accounts = isEncrypted
    ? await encryptText(JSON.stringify(accs, null, 0), password)
    : accs
  StorageService.setObject('accounts', accounts)
  StorageService.setObject('isEncrypted', isEncrypted)
}

/**
 * Middleware
 */
export const accountsMiddleware = store => next => async action => {
  const ret = next(action)
  if (
    action.type === 'ADD_ACCOUNT' ||
    action.type === 'ADD_ACCOUNTS' ||
    action.type === 'UPDATE_ACCOUNT' ||
    action.type === 'DELETE_ACCOUNT'
  ) {
    if (StorageService.isSupported()) {
      const state = store.getState()
      await persitStateToLocalStorage(
        getAccounts(state),
        isEncrypted(state),
        getPassword(state)
      )
    }
  }
  if (action.type === 'ADD_ACCOUNT') notify('Successfully created')
  if (action.type === 'ADD_ACCOUNTS') notify('Accounts successfully added')
  if (action.type === 'UPDATE_ACCOUNT') notify('Successfully updated')
  if (action.type === 'DELETE_ACCOUNT') notify('Successfully deleted')
  return ret // Do not interrupt the chain
}

/**
 * Selector
 */
export const getAccounts = state => state.accounts
export const getAccountsWithoutOtp = state =>
  state.accounts.map(({ otp, ...rest }) => rest)

const uniqueAccountName = (state, accountName) => {
  let name = accountName
  let i = 2
  const nameEqual = name =>
    state.find(({ accountName }) => accountName === name)
  while (nameEqual(name)) {
    name = `${accountName} (${i++})`
  }
  return name
}

/**
 * Reducer
 */
const reducer = (state = [], action) => {
  switch (action.type) {
    case 'REFRESH_OTPS':
      return state.map(account => ({
        ...account,
        otp: KeyUtilities.generate(account.secret)
      }))
    case 'ADD_ACCOUNT':
      const accountName = uniqueAccountName(state, action.payload.accountName)
      return [
        ...state,
        {
          ...action.payload,
          accountName,
          otp: KeyUtilities.generate(action.payload.secret)
        }
      ]
    case 'ADD_ACCOUNTS':
      return action.payload.reduce((acc, account) => {
        let accountName = uniqueAccountName(acc, account.accountName)
        return [
          ...state,
          {
            ...action.payload,
            accountName,
            otp: KeyUtilities.generate(action.payload.secret)
          }
        ]
      }, state)

    case 'UPDATE_ACCOUNT': // no need to refresh otp, keep old one from state
      if (action.payload.oldAccountName === action.payload.newAccountName)
        return state
      return state.map(account => {
        if (account.accountName === action.payload.oldAccountName)
          return { ...account, accountName: action.payload.newAccountName }
        return account
      })
    case 'DELETE_ACCOUNT':
      return state.filter(({ accountName }) => accountName !== action.payload)
    default:
      return state
  }
}

export default reducer
