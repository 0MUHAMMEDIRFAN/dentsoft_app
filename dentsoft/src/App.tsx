import { useState } from 'react'
import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'
import Home from './pages/Home.tsx'
import { Routes, Route } from 'react-router-dom'
import Overview from './pages/Overview.tsx'
import MainLayout from './screens/MainLayout.tsx'

function App() {

	return (
		<div className="App">
			<FrappeProvider
				socketPort={import.meta.env.VITE_SOCKET_PORT}
				siteName={import.meta.env.VITE_SITE_NAME}
			>
				<Routes>
					{/* <Route path='' element={<MainLayout />} > */}
					<Route path="/home" element={<Home />} exact />
					{/* <Route path="/home" element={<Overview/>} exact /> */}
					{/* <Route path="/patient/overview" element={<Overview />} exact /> */}
					<Route path="/scope" element={<Overview />} exact />
					{/* </Route> */}
				</Routes>
			</FrappeProvider>
		</div>
	)
}

export default App
