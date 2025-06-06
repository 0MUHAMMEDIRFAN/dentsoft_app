// import { useState } from 'react'
import { FrappeProvider, useFrappeAuth } from 'frappe-react-sdk'
import Home from './pages/Home.tsx'
import { Routes, Route, Router, RouterProvider, createBrowserRouter, createRoutesFromElements, BrowserRouter } from 'react-router-dom'
import Overview from './pages/Overview.tsx'
import MainLayout from './screens/MainLayout.tsx'
import Login from './components/Login/Login.tsx'
import { ProtectedRoute } from './utils/auth/ProtectedRoute.tsx'
import AuthRedirect from './utils/auth/AuthRedirect.tsx'
import { ToastContextProvider } from './contexts/ToastContext.tsx'
import { AppContextProvider } from './contexts/AppContext.tsx'
import { ApiContextProvider } from './contexts/ApiContext.tsx'
import UserManagement from './pages/UserManagement.tsx'
import Schemes from './pages/Schemes.tsx'
import Treatments from './pages/Treatments.tsx'
import Payments from './pages/Payments.tsx'
import Appointments from './pages/Appointments.tsx'
import Documents from './pages/Documents.tsx'
import MedicalHistory from './pages/MedicalHistory.tsx'
import ReportAnalysis from './pages/ReportandAnanysis.tsx'

function App() {
	// const router = createBrowserRouter(
	// 	createRoutesFromElements(

	// 	)
	// )

	const getSiteName = () => {
		if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
			return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
		}
		return import.meta.env.VITE_SITE_NAME

	}
	// const { currentUser } = useFrappeAuth();
	return (
		<FrappeProvider
			// url='localhost:9004'
			enableSocket={true}
			socketPort={import.meta.env.VITE_SOCKET_PORT}
			siteName={getSiteName()}
		>
			<BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
				<div className="App">
					<ToastContextProvider>
						<AppContextProvider>
							<ApiContextProvider>

								<Routes>
									{/* the below component is used to check the user is authenticated or not */}
									<Route path='/' element={<ProtectedRoute />} >
										<Route path='/' element={<MainLayout />} >
											<Route path="" element={<Home />} />
											{/* {selectedPatient ?
												<> */}
													<Route path="/patient/overview" element={<Overview />} exact />
													<Route path="patient/appointments" element={<Appointments />} exact />
													<Route path="patient/documents" element={<Documents />} exact />
													<Route path="patient/medicalhistory" element={<MedicalHistory />} exact />
													<Route path="patient/payments" element={<Payments />} exact />
												{/* </> : <> */}
													{/* {userDetails?.name === "admin" && <Route path="user-managment" element={<UserManagement />} exact />} */}
													<Route path="user-managment" element={<UserManagement />} exact />
													<Route path="report-and-analysis" element={<ReportAnalysis />} exact />
													<Route path="schemes" element={<Schemes />} exact />
													<Route path="treatments" element={<Treatments />} exact />
												{/* </>} */}
										</Route>
										<Route path="dentalChart" element={<Overview />} />
									</Route>
									<Route path='/login' element={<AuthRedirect />}>
										<Route path='' element={<Login />}></Route>
									</Route>
								</Routes>
							</ApiContextProvider>
						</AppContextProvider>
					</ToastContextProvider>
				</div>
			</BrowserRouter>
		</FrappeProvider >
	)
}

export default App
