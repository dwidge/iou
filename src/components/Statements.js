import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnRef, ColumnButton, getItemBy } from '@dwidge/table-react'
import { today, uuid } from '@dwidge/lib'
import { sendWatsapp, replaceKV, formatDate, formatPrice, byDateAsc } from './lib'
import BTable from 'react-bootstrap/Table'
import BButton from 'react-bootstrap/Button'
import genTable from 'text-table'

import Form from 'react-bootstrap/Form'
import TextArea from './TextArea'

const txtDefault = `
Hello [clientname],

This is the statement for client (ref [clientref]) on [date].

Client ref: [clientref]
Date: [date]
Balance due: [balance]

\`\`\`[table]\`\`\`
`.trim()

const fields = (row, client, preview) => ({
	'[clientname]': client?.name,
	'[clientref]': client?.ref,
	'[date]': today(),
	'[balance]': (+row?.balance || 0).toFixed(2),
	'[table]': preview && genTable(preview.map(({ date = '-', ref = '-', desc = '-', total = '-' }) => [date, ref, desc, total])),
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
	const [preview, previewSet] = useState()

	const genPreview = (row, client) => {
		const invoicerows = aInvoices.filter(inv => inv.client === client.ref)
		const receiptrows = aReceipts.filter(inv => inv.client === client.ref).map(r => ({ ...r, desc: 'payment', date: formatDate(r.date), total: formatPrice(r.total) }))
		return invoicerows.concat(receiptrows).sort(byDateAsc('date'))
	}
	const previewRef = useRef()
	const scroll = ref => setTimeout(() => ref.current.scrollIntoView(), 0)

	return (<>
		<Table name='Statements' schema={{
			client: ColumnRef('ClientRef', { all: aClients, colRef: 'ref', colView: 'name' }),
			balance: ColumnText('BalanceDue', formatPrice),
			view: ColumnButton('', (_, row, client = getItemBy(aClients, row.client, 'ref')) => {
				previewSet({ rows: genPreview(row, client), client })
				scroll(previewRef)
			}, () => 'View'),
			send: ColumnButton('', (_, row, client = getItemBy(aClients, row.client, 'ref')) => sendWatsapp(client?.phone, replaceKV(txt)(fields(row, client, genPreview(row, client)))), () => 'Send'),
		}} rows={[statements, () => {}]} newRow={() => {}} addDel={false} />
		<p ref={previewRef} className='pt-3'>
			{preview
				? (<>
					<h2>Statement</h2>
					<h3>{preview.client.name}</h3>
					<BTable responsive hover><thead><tr>
						<td>date</td>
						<td>ref</td>
						<td>desc</td>
						<td>total</td>
					</tr></thead>
					<tbody>{preview.rows.map(({ date, ref, desc, total }) => (
						<tr key={ref}>
							<td>{date}</td>
							<td>{ref}</td>
							<td>{desc}</td>
							<td>{total}</td>
						</tr>
					))}</tbody></BTable>
				</>)
				: ''}
		</p>
		<Settings txt={[txt, txtStatement => setsettings({ ...settings, txtStatement })]} />
	</>)
}

function Settings({ txt }) {
	return (
		<Form className="mt-3">
			<TextArea label='Message Template' txt={txt} />
			<BButton onClick={() => txt[1](txtDefault)}>Reset</BButton>
			<p className="mt-3">Keywords<br/>
				{Object.keys(fields()).join(',')}</p>
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
