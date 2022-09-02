import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnRef, ColumnButton, getItemBy } from '@dwidge/table-react'
import { today, uuid } from '@dwidge/lib'
import { sendWatsapp, replaceKV } from './lib'

import Form from 'react-bootstrap/Form'
import TextArea from './TextArea'

const txtDefault = `
Hello [clientname],

This is the statement for client (ref [clientref]) on [date].

ClientRef: [clientref]
Date: [date]
Balance: [balance]
`.trim()

const fields = (row, client) => ({
	'[clientname]': client.name,
	'[clientref]': client.ref,
	'[date]': today(),
	'[balance]': (+row.balance).toFixed(2),
})

const Statements = ({ aClients, aInvoices, aReceipts, stSettings }) => {
	const sum = (t, v) => (+t || 0) + (+v || 0)

	const calcBalance = clientref => {
		const invoicetotal = aInvoices.filter(inv => inv.client === clientref).map(inv => inv.total).reduce(sum, 0)
		const receipttotal = aReceipts.filter(inv => inv.client === clientref).map(inv => inv.total).reduce(sum, 0)
		return invoicetotal - receipttotal
	}

	const statements = aClients.map(client =>
		({
			id: uuid(),
			client: client.ref,
			balance: calcBalance(client.ref),
		}),
	)

	const [settings, setsettings] = stSettings
	const txt = settings.txtStatement || txtDefault

	return (<>
		<Table name='Statements' schema={{
			client: ColumnRef('ClientRef', { all: aClients, colRef: 'ref', colView: 'name' }),
			balance: ColumnText('BalanceDue'),
			_send: ColumnButton('Send', (_, row, client = getItemBy(aClients, row.client, 'ref')) => sendWatsapp(client?.phone, replaceKV(txt)(fields(row, client))), () => 'Send'),
		}} rows={[statements, () => {}]} newRow={() => {}} addDel={false} />
		<Settings txt={[txt, txtStatement => setsettings({ ...settings, txtStatement })]} />
	</>)
}

function Settings({ txt }) {
	return (
		<Form className="mt-3">
			<TextArea label='Message Template' txt={txt} />
		</Form>
	)
}

Settings.propTypes = {
	txt: PropTypes.array.isRequired,
}

Statements.propTypes = {
	aClients: PropTypes.array.isRequired,
	aInvoices: PropTypes.array.isRequired,
	aReceipts: PropTypes.array.isRequired,
	stSettings: PropTypes.array.isRequired,
}

export default Statements
