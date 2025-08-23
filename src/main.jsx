import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  // React 18 开发模式 + StrictMode 会把组件的 useEffect 执行两次，所以通常会看到两次接口请求。
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)