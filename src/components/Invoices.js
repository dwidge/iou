import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnDate, ColumnRef, ColumnButton, getItemBy } from '@dwidge/table-react'
import { today, uuid } from '@dwidge/lib'
import { sendWatsapp, replaceKV, newRef } from './lib'
import { onChange } from '@dwidge/lib-react'

import Form from 'react-bootstrap/Form'
import TextArea from './TextArea'

const txtDefault = `
Hello [clientname],

This is the invoice (ref [invoiceref]) for client (ref [clientref]). Please quote the invoice ref on your payment beneficiary ref.

ClientRef: [clientref]
InvoiceRef: [invoiceref]
Date: [date]
Summary: [summary]
Total: R [total]
`.trim()
const fields = (row, client) => ({
	'[clientname]': client.name,
	'[clientref]': client.ref,
	'[invoiceref]': row.ref,
	'[date]': row.date,
	'[summary]': row.summary,
	'[total]': (+row.total).toFixed(2),
})

const Invoices = ({ stInvoices, aClients, stSettings }) => {
	const [settings, setsettings] = stSettings
	const txt = settings.txtInvoice || txtDefault

	return (<>
		<Table name='Invoices' schema={{
			ref: ColumnText('InvoiceRef'),
			client: ColumnRef('ClientRef', { all: aClients, colRef: 'ref', colView: 'name' }),
			date: ColumnDate('Date'),
			summary: ColumnText('Summary'),
			total: ColumnText('Total'),
			_send: ColumnButton('Send', (_, row) => {
				const client = getItemBy(aClients, row.client, 'ref')
				sendWatsapp(client?.phone, replaceKV(txt)(fields(row, client)))
			}, () => 'Send'),
		}} newRow={() => ({ id: uuid(), ref: newRef(stSettings)('invpre', 'invnext')(), client: '', date: today(), summary: '', total: 0 })} rows={stInvoices} inlineHeadersEdit={true} />
		<Settings txt={[txt, txtInvoice => setsettings({ ...settings, txtInvoice })]} refPre={[settings.invpre, invpre => setsettings({ ...settings, invpre })]} refNext={[settings.invnext, invnext => setsettings({ ...settings, invnext })]} />
	</>)
}

function Settings({ txt, refPre, refNext }) {
	return (
		<Form className="mt-3">
			<TextArea label='Message Template' txt={txt} />
			<Form.Group className="mb-3">
				<Form.Label>Ref prefix</Form.Label>
				<Form.Control type="text" value={refPre[0]} onChange={onChange(refPre[1])} />
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Ref next</Form.Label>
				<Form.Control type="text" value={refNext[0]} onChange={onChange(refNext[1])} />
			</Form.Group>
		</Form>
	)
}

Settings.propTypes = {
	txt: PropTypes.array.isRequired,
	refPre: PropTypes.array.isRequired,
	refNext: PropTypes.array.isRequired,
}

Invoices.propTypes = {
	stInvoices: PropTypes.array.isRequired,
	aClients: PropTypes.array.isRequired,
	stSettings: PropTypes.array.isRequired,
}

export default Invoices
