import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText } from '@dwidge/table-react'

const Settings = ({ stSettings }) =>
	(<>
		<Table name='Settings' schema={{
			clnpre: ColumnText('Client Prefix'),
			clnnext: ColumnText('Client Next'),
			jobpre: ColumnText('Job Prefix'),
			jobnext: ColumnText('Job Next'),
			paypre: ColumnText('Payment Prefix'),
			paynext: ColumnText('Payment Next'),
			invpre: ColumnText('Invoice Prefix'),
			invnext: ColumnText('Invoice Next'),
		}} defaults={{}} rows={stSettings} pageLength={1} inlineHeaders={true} addDel={false} newRow={() => {}} />
	</>)

Settings.propTypes = {
	stSettings: PropTypes.array.isRequired,
}

export default Settings
