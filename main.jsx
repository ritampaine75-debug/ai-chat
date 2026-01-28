import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css' 

// এই ফাইলে আগে 'index.css' ইম্পোর্ট করা ছিল যা এরর দিচ্ছিল, সেটা সরিয়ে দিয়েছি।

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
