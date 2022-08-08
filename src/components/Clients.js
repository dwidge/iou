import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText } from '@dwidge/table-react'
import { uuid } from '@dwidge/lib'

const Clients = ({ stClients, newId = uuid }) =>
	(<>
		<Table name='Clients' schema={{
			id: ColumnText('Ref'),
			name: ColumnText('Name'),
			phone: ColumnText('Phone'),
		}} newRow={() => ({ id: newId(), name: 'client', phone: '000' })} rows={stClients} />
	</>)

Clients.propTypes = {
	stClients: PropTypes.array.isRequired,
	newId: PropTypes.func,
}

export default Clients
