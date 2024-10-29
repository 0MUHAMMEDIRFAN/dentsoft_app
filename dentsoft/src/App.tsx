import { useState } from 'react'
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'
import Home from './pages/Home.tsx'
import { Routes, Route } from 'react-router-dom'
import Overview from './pages/Overview.tsx'
import MainLayout from './screens/MainLayout.tsx'
import Login from './components/Login/Login.tsx'

function App() {
	const getSiteName = () => {
		if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
			return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
		}
		return import.meta.env.VITE_SITE_NAME

	}
	// const { currentUser } = useFrappeAuth();
	return (
		<div className="App">
			<FrappeProvider
				socketPort={import.meta.env.VITE_SOCKET_PORT}
				siteName={getSiteName()}
			>
				<Routes>
					<Route path='/' element={<MainLayout />} >
						<Route path="home" element={<Home />} />
						{/* <Route path="/home" element={<Overview/>}  /> */}
						{/* <Route path="/patient/overview" element={<Overview />}  /> */}
						<Route path="dentsoft" element={<Overview />} />
					</Route>
					<Route path='/login' element={<Login />}>

					</Route>
				</Routes>
			</FrappeProvider>
		</div>
	)
}

export default App
