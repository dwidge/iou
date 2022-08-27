import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText } from '@dwidge/table-react'
import { uuid } from '@dwidge/lib'

const Clients = ({ stClients, newId = uuid }) =>
	(<>
		<Table name='Clients' schema={{
			ref: ColumnText('Ref'),
			name: ColumnText('Name'),
			phone: ColumnText('Phone'),
			patterns: ColumnText('Patterns'),
		}} newRow={() => ({ id: uuid(), ref: newId(), name: 'client', phone: '555', patterns: '' })} rows={stClients} />
	</>)

Clients.propTypes = {
	stClients: PropTypes.array.isRequired,
	newId: PropTypes.func,
}

export default Clients
