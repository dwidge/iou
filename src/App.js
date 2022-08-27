import React, { useState, useEffect } from 'react'
import { Storage } from '@dwidge/lib-react'

import Clients from './components/Clients'
import Invoices from './components/Invoices'
import Receipts from './components/Receipts'
import Bank from './components/Bank'
import Statements from './components/Statements'
import Settings from './components/Settings'
import Navbar from './components/Navbar'
import { newRef } from './components/lib'

// import './App.css'
const { useStorage } = Storage(useState, useEffect)

const defaultSettings = {
	id: 1,
	clnpre: 'C',
	clnnext: 1,
	stmpre: 'S',
	stmnext: 1,
	recpre: 'R',
	recnext: 1,
	invpre: 'I',
	invnext: 1,
}

const App = () => {
	const stClients = useStorage('iou_clients', [])
	const stInvoices = useStorage('iou_invoices', [])
	const stReceipts = useStorage('iou_receipts', [])
	const stSettings1 = useStorage('iou_settings', defaultSettings)
	const [getsettings, setsettings] = stSettings1
	const settings = { ...defaultSettings, ...getsettings }
	const stSettings = [settings, setsettings]

	return (
		<Navbar brand='IoU' pages={{
			'/clients': { name: 'Clients', element: (<Clients stClients={stClients} newId={newRef(stSettings)('clnpre', 'clnnext')} />) },
			'/invoices': { name: 'Invoices', element: (<Invoices stInvoices={stInvoices} aClients={stClients[0]} stSettings={stSettings} />) },
			'/receipts': { name: 'Receipts', element: (<Receipts stReceipts={stReceipts} aClients={stClients[0]} stSettings={stSettings} />) },
			'/bank': { name: 'Bank', element: (<Bank stReceipts={stReceipts} stClients={stClients} stSettings={stSettings} />) },
			'/statements': { name: 'Statements', element: (<Statements aClients={stClients[0]} aInvoices={stInvoices[0]} aReceipts={stReceipts[0]} stSettings={stSettings} />) },
			'/settings': { name: 'Settings', element: (<Settings stSettings={stSettings} />) },
		}}/>
	)
}

export default App
