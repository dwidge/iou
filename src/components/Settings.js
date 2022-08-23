import React from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText } from '@dwidge/table-react'

const Settings = ({ stSettings }) =>
	(<>
		<Table name='Settings' schema={{
			clnpre: ColumnText('Client Prefix'),
			clnnext: ColumnText('Client Next'),
			invpre: ColumnText('Invoice Prefix'),
			invnext: ColumnText('Invoice Next'),
			recpre: ColumnText('Receipt Prefix'),
			recnext: ColumnText('Receipt Next'),
		}} defaults={{}} rows={[[stSettings[0]], ([o]) => stSettings[1](o)]} pageLength={1} inlineHeaders={true} addDel={false} newRow={() => {}} />
	</>)

Settings.propTypes = {
	stSettings: PropTypes.array.isRequired,
}

export default Settings
