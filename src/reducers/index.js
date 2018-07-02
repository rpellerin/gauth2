import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import StorageService from 'utils/storageService'
import accounts, { accountsMiddleware } from 'reducers/accounts'
import encryption, { encryptionMiddleware } from 'reducers/encryption'
import { decryptText } from 'utils/WebCrypto'

const generateStateFromLocalStorage = async () => {
  const isEncrypted = JSON.parse(
    StorageService.getObject('isEncrypted') || false
  )
  const accounts = StorageService.getObject('accounts') || []
  let password = null
  if (isEncrypted) {
    password = window.prompt(
      'Local storage is encrypted. Please provide password to access stored accounts:'
    )
  }
  let decryptedAccounts = accounts
  if (isEncrypted) {
    try {
      decryptedAccounts = await decryptText(accounts, password)
      decryptedAccounts = JSON.parse(decryptedAccounts)
    } catch (e) {
      window.alert('Error decrypting local storage')
      decryptedAccounts = []
    }
  }
  return {
    accounts: decryptedAccounts,
    encryption: { isEncrypted, password }
  }
}

const buildStore = (defaultState = { accounts: [], encryption: {} }) =>
  createStore(
    combineReducers({
      accounts,
      encryption
    }),
    defaultState,
    compose(
      applyMiddleware(accountsMiddleware, encryptionMiddleware),
      // ReduxDevtools browser extension
      typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    )
  )

export default () =>
  new Promise((resolve, reject) => {
    if (StorageService.isSupported()) {
      generateStateFromLocalStorage().then(defaultState =>
        resolve(buildStore(defaultState))
      )
    } else {
      window.alert('No support for LocalStorage')
      resolve(resolve(buildStore()))
    }
  })
