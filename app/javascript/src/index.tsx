import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store, { persistor } from './store'
import App from './ui/app/App'
import { PersistGate } from 'redux-persist/integration/react'

export default function start (): void {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App/>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
  reportWebVitals(console.log)
}
