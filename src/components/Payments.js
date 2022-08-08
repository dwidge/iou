import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnDate, ColumnRef } from '@dwidge/table-react'
import { today, uuid } from '@dwidge/lib'

const Payments = ({ stPayments, aClients, newId = uuid }) =>
	(<>
		<Table name='Payments' schema={{
			id: ColumnText('Ref'),
			date: ColumnDate('Date'),
			client: ColumnRef('Client', aClients, c => c.name),
			money: ColumnText('Money'),
		}} newRow={() => ({ id: newId(), date: today(), client: '', money: 0 })} rows={stPayments} />
	</>)

Payments.propTypes = {
	stPayments: PropTypes.array.isRequired,
	aClients: PropTypes.array.isRequired,
	newId: PropTypes.func,
}

export default Payments
