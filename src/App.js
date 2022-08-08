import React, { useState, useEffect } from 'react'
import {
	Routes,
	Route,
	NavLink,
} from 'react-router-dom'
import PropTypes from 'prop-types'
import { Storage } from '@dwidge/lib-react'

import Clients from './components/Clients'
import Jobs from './components/Jobs'
import Payments from './components/Payments'
import Invoices from './components/Invoices'
import Settings from './components/Settings'

import './App.css'
const { useStorage } = Storage(useState, useEffect)

const defaultSettings = {
	id: 1,
	clnpre: 'C',
	clnnext: 1,
	jobpre: 'J',
	jobnext: 1,
	paypre: 'P',
	paynext: 1,
	invpre: 'I',
	invnext: 1,
}

const App = () => {
	const stClients = useStorage('iou_clients', [])
	const stJobs = useStorage('iou_jobs', [])
	const stPayments = useStorage('iou_payments', [])
	const stInvoices = useStorage('iou_invoices', [])
	const stSettings = useStorage('iou_settings1', [defaultSettings])
	const [getsettings, setsettings] = stSettings
	const settings = { ...defaultSettings, ...getsettings[0] }

	const newId = (kpre, knext) => () => {
		const pre = settings[kpre]
		const next = settings[knext]
		const id = pre + ('' + next).padStart(3, '0')
		setsettings([{ ...settings, [knext]: +next + 1 }])
		return id
	}

	return (<Pages pages={{
		'/clients': { name: 'Clients', element: (<Clients stClients={stClients} newId={newId('clnpre', 'clnnext')} />) },
		'/jobs': { name: 'Jobs', element: (<Jobs stJobs={stJobs} aClients={stClients[0]} newId={newId('jobpre', 'jobnext')} />) },
		'/payments': { name: 'Payments', element: (<Payments stPayments={stPayments} aClients={stClients[0]} newId={newId('paypre', 'paynext')} />) },
		'/Invoices': { name: 'Invoices', element: (<Invoices stInvoices={stInvoices} aClients={stClients[0]} newId={newId('invpre', 'invnext')} />) },
		'/settings': { name: 'Settings', element: (<Settings stSettings={[[settings], setsettings]} />) },
	}}/>)
}

const Pages = ({ pages }) => {
	const pagesArray = Object.entries(pages)

	return (
		<>
			<nav>
				{pagesArray.map(([path, { name }]) =>
					(<NavLink key={path} className={({ isActive }) => isActive ? 'link-active' : 'link'} to={path}>{name}</NavLink>))}
			</nav>
			<div className="page">
				<Routes>
					{pagesArray.map(([path, { element }]) =>
						(<Route key={path} path={path} element={element}/>),
					)}
					<Route path='/' />
				</Routes>
			</div>
		</>
	)
}

Pages.propTypes = {
	pages: PropTypes.object.isRequired,
}

export default App
