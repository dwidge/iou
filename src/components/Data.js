import React from 'react'
import PropTypes from 'prop-types'
import { calcCsvFromObjects, calcObjectsFromCsv } from '@dwidge/lib'
import { ImportFile, saveText } from '@dwidge/table-react'
import TinyXLSX from 'tiny-xlsx'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const Data = ({ tables: ts }) => {
	const tables = Object.entries(ts)

	const isClear = (ts = tables) =>
		ts.every(([key, [get, set]]) => !get?.length)

	const clearAll = (ts = tables) => {
		ts.forEach(([key, [get, set]]) => set(isArray(get) ? [] : {}))
	}

	const isArray = a => a instanceof Array
	// const isObject=a=>a instanceof Object

	const importFormat = (importer, ext = '.txt', ts = tables, input) => {
		try {
			if (!isClear(ts) && !confirm('Combine with existing?')) return

			const keys = ts.map(([key]) => key)
			const data = importer(input, keys)

			ts.forEach(([key, [get, set]]) => {
				if (data && data[key]) { set(isArray(get) ? get.concat(data[key]) : ({ ...get, ...data[key] })) }
			})
		} catch (e) {
			alert('Not valid format.' + e.stack)
		}
	}

	const exportFormat = async (exporter, ext = '.txt', ts = tables) => {
		const fdata = await exporter(ts)
		if (!fdata) return
		const fname = ts.map(([key]) => key).join(' ') + ext
		saveText(fdata, fname)
	}

	const importCSV = (input, keys = []) =>
		Object.fromEntries(input.split(/\r?\n\r?\n/g).map((t, i) => {
			const lines = t.split(/\r?\n/g)
			const first = lines[0].match(/^"?#(.*?)"?$/)[1]

			const key = first || keys[i]
			const rows = calcObjectsFromCsv(first ? lines.slice(1).join('\n') : t)
			return [key, rows]
		}))

	const importJSON = (input) =>
		JSON.parse(input)

	const exportCSV = (ts = tables) =>
		ts.map(([key, [get, set]]) => '"#' + key + '"' + '\r\n' + calcCsvFromObjects(isArray(get) ? get : [get])).join('\r\n\r\n')

	const exportJSON = (ts = tables) =>
		JSON.stringify(Object.fromEntries(ts.map(([key, [get, set]]) => [key, get])), null, 2)

	const exportXLS = (ts = tables) => {
		const sheets = ts.map(([key, [get, set]]) => ({
			title: key,
			data: isArray(get) ? [Object.keys(get[0] || {}), ...get.map(r => Object.values(r))] : [Object.keys(get || {}), Object.values(get || {})],
		}))

		TinyXLSX.generate(sheets).base64().then(base64 => {
			location.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + base64
		})
	}

	const formats = {
		CSV: ['.csv', importCSV, exportCSV],
		XLSX: ['.xlsx', null, exportXLS],
		JSON: ['.json', importJSON, exportJSON],
	}

	const Exports = ({ data }) =>
		(<>
			<Card>
				<Card.Body>
					<Card.Title>{data.map(([key, [get, set]]) => key).join(' ')}</Card.Title>
					{data.map(([key, [get, set]]) => (
						<p key={key}>{key}: {isArray(get) ? get.length : Object.keys(get).join(' ')}</p>
					))}
					<Button onClick={() => clearAll(data)}>Clear</Button>
					<Table size="sm" className="mt-3">
						<thead>
							<tr>
								<th>Import</th>
								<th>Export</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(formats).map(([formatkey, [ext, importer, exporter]]) => (
								<tr key={formatkey}>
									<td>{importer ? (<ImportFile ext={ext} onAccept={(input) => importFormat(importer, ext, data, input)}/>) : ''}</td>
									<td>{exporter ? (<Button onClick={() => exportFormat(exporter, ext, data)}>Export {ext}</Button>) : ''}</td>
								</tr>),
							)}
						</tbody>
					</Table>
				</Card.Body>
			</Card>
		</>)
	Exports.propTypes = {
		data: PropTypes.array.isRequired,
	}

	return (
		<div-page data-testid="pageData">
			<Exports data={tables}/>
			{tables.map(t => (
				<div key={t[0]} className="mt-3"><Exports data={[t]}/></div>
			))}
			<p className="mt-3">Import/export to backup, transfer between devices or use with a spreadsheet program.</p>
		</div-page>
	)
}

Data.propTypes = {
	tables: PropTypes.object.isRequired,
}

export default Data
