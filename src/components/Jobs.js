import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnDate, ColumnRef } from '@dwidge/table-react'
import { today, uuid } from '@dwidge/lib'

const Jobs = ({ stJobs, aClients, newId = uuid }) =>
	(<>
		<Table name='Jobs' schema={{
			id: ColumnText('Ref'),
			date: ColumnDate('Date'),
			client: ColumnRef('Client', aClients, c => c.name),
			desc: ColumnText('Desc'),
			money: ColumnText('Money'),
		}} newRow={() => ({ id: newId(), date: today(), client: '', desc: 'job', money: 0 })} rows={stJobs} />
	</>)

Jobs.propTypes = {
	stJobs: PropTypes.array.isRequired,
	aClients: PropTypes.array.isRequired,
	newId: PropTypes.func,
}

export default Jobs
