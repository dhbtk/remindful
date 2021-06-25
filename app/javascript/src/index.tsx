import React from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import App from './ui/App/App'

export default function start (): void {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App/>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
  reportWebVitals(console.log)
}
