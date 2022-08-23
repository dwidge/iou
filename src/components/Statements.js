import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnRef, ColumnButton, getItemBy } from '@dwidge/table-react'
import { today } from '@dwidge/lib'
import { sendClient } from './lib'
import { onChange } from '@dwidge/lib-react'

import Form from 'react-bootstrap/Form'

const txtDefault = `
Hello [clientname],

This is the statement for client (ref [clientref]) on [date].

ClientRef: [clientref]
Date: [date]
Balance: [balance]
`

const fields = (row, client) => ({
	'[clientname]': client.name,
	'[clientref]': client.ref,
	'[date]': today(),
	'[balance]': row.balance,
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
			client: client.ref,
			balance: calcBalance(client.ref),
		}),
	)

	const [settings, setsettings] = stSettings
	const txt = settings.txtStatement || txtDefault

	return (<>
		<Table name='Statements' schema={{
			client: ColumnRef('ClientRef', aClients, c => c.name, 'ref'),
			balance: ColumnText('BalanceDue'),
			_send: ColumnButton('Send', (_, row, client = getItemBy(aClients, row.client, 'ref')) => sendClient(client, txt, fields(row, client)), () => 'Send'),
		}} rows={[statements, () => {}]} newRow={() => {}} />
		<Settings txt={[txt, txtStatement => setsettings({ ...settings, txtStatement })]} />
	</>)
}

function Settings({ txt }) {
	return (
		<Form>
			<Form.Group className="mb-3">
				<Form.Label>Message Template</Form.Label>
				<Form.Control as="textarea" rows={5} onChange={onChange(txt[1])} value={txt[0]} />
			</Form.Group>
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
