import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnDate, ColumnRef, ColumnButton } from '@dwidge/table-react'
import { today, uuid, getItemById } from '@dwidge/lib'

const watsapp = (num, text) => {
	if (!num) alert('Couldn\'t send, needs number')
	else { window.open(`https://wa.me/${encodeURIComponent(num.split(' ').join(''))}?text=${encodeURIComponent(text)}`, '_blank') }
}

const Invoices = ({ stInvoices, aClients, newId = uuid }) =>
	(<>
		<Table name='Invoices' schema={{
			id: ColumnText('Ref'),
			date: ColumnDate('Date'),
			client: ColumnRef('Client', aClients, c => c.name),
			jobs: ColumnText('Jobs'),
			payments: ColumnText('Payments'),
			balance: ColumnText('Balance'),
			_send: ColumnButton('Send', (_, row) => {
				const client = getItemById(aClients, row.client)
				if (client) { watsapp(client.phone, `Hello ${client.name},\nThis is a test invoice ${row.id} for client ${row.client}.`) }
			}, () => 'Send'),
		}} newRow={() => ({ id: newId(), date: today(), client: 0, jobs: [], payments: [], balance: 0 })} rows={stInvoices} inlineHeadersEdit={true} />
	</>)

Invoices.propTypes = {
	stInvoices: PropTypes.array.isRequired,
	aClients: PropTypes.array.isRequired,
	newId: PropTypes.func,
}

export default Invoices
