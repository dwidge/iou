import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnDate, ColumnRef } from '@dwidge/table-react'
import { today, uuid } from '@dwidge/lib'
import { newRef, formatDate, formatPrice, parsePrice } from './lib'

const parseReceipts = a =>
	a.map(({ date, total, ...r }) => ({ ...r, date: formatDate(date), total: parsePrice(total) }))

const Receipts = ({ stReceipts: [receipts, receiptsSet], aClients, stInvoices: [invoices, invoicesSet], stSettings }) =>
	(<>
		<Table name='Receipts' schema={{
			ref: ColumnText('Ref'),
			date: ColumnDate('Date'),
			client: ColumnRef('Client', { all: aClients, colRef: 'ref', colView: 'name' }),
			invoice: ColumnRef('Invoice', { all: invoices, colRef: 'ref', colView: 'date', colDisplay: 'ref' }),
			total: ColumnText('Total', formatPrice),
		}} newRow={() => ({ id: uuid(), ref: newRef(stSettings)('recpre', 'recnext')(), date: today(), client: '', total: 0 })} rows={[parseReceipts(receipts), receiptsSet]} />
	</>)

Receipts.propTypes = {
	stReceipts: PropTypes.array.isRequired,
	aClients: PropTypes.array.isRequired,
	stInvoices: PropTypes.array.isRequired,
	stSettings: PropTypes.array.isRequired,
}

export default Receipts
