import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import generateStore from 'reducers'
import App from 'App'
import registerServiceWorker from 'utils/registerServiceWorker'

generateStore().then(store => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
  registerServiceWorker()
})
