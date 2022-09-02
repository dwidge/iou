import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, ColumnText, ColumnRef, ColumnButton, getItemBy } from '@dwidge/table-react'
import { today, uuid, unique, replaceItemById } from '@dwidge/lib'
import { newRef } from './lib'
import wcmatch from 'wildcard-match'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import TextArea from './TextArea'

const regDate =
'[0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4}'
const regNum =
'\\d+(?:[\\,]\\d+)*(?:[\\.]\\d+)?'
const regStr = '.+'
const regTransaction = new RegExp(`(${regDate}) (${regStr}) (${regNum}) (${regStr} )?(${regNum})`)

const isReg = reg => s =>
	reg.test(s)

const parseReg = reg => s =>
	reg.exec(s)

const findClients = (clients, s) =>
	clients.filter(stringMatchesClient(s)).map(c => c.name)

const stringMatchesClient = s => (client) =>
	matcherFromClient(client)(s)

const matcherFromClient = ({ patterns = '' }) =>
	wcmatch(patterns.split('\n'))

const calcPattern = s =>
	s.split(/\d+/g).join('*').trim()

const findReceipt = all => ({ date, client, total }) => all.find(r => r.date === date && r.client === client && (+r.total) === (+total))

// stackoverflow.com/a/50636286
function partition(array, filter) {
	const pass = []; const fail = []
	array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e))
	return [pass, fail]
}

const numFromStr = str =>
	(+str.split(',').join('')).toFixed(2)

const DetectReceipts = ({ stClients: [clients, clientsSet] = [], stInvoices: [invoices, invoicesSet] = [], newClientId = uuid, stReceipts: [rec, setrec] = [], stSettings: [conf,, confSetKey] = [] }) => {
	const [msg, msgSet] = useState('')
	const [txt, settxt] = useState('')
	const [ignoretxt, ignoretxtSet] = [conf.txtIgnore || '', txtIgnore => confSetKey('txtIgnore', txtIgnore)]
	const [receipts, setreceipts] = useState([])
	const ignorelist = ignoretxt.split('\n').map(s => s.trim()).filter(s => s)

	useEffect(() => {
		setreceipts(txt.split('\n').filter(isReg(regTransaction)).map(parseReg(regTransaction)).map(([all, date, desc, total, star, balance]) => {
			const match = findClients(clients, desc)
			return ({
				id: uuid(),
				clientname: match[0],
				date,
				desc,
				total: numFromStr(total),
				balance: numFromStr(balance),
				match: match.join('\n'),
				pattern: calcPattern(desc),
			})
		},
		))
	}, [txt])

	const newClient = ({ name, patterns }) =>
		({ id: uuid(), ref: newClientId(), name, phone: '+27', patterns })

	const addClient = ({ clientname, pattern } = {}) => {
		if (clientname && !getItemBy(clients, clientname, 'name')) {
			clientsSet(clients.concat(newClient({ name: clientname, patterns: pattern })))
		} else alert(clientname ? clientname + ' exists.' : 'Enter a name.')
	}

	const onAddAll = () => {
		const [toAdd, toReject] = partition(receipts.map(r => ({ ...r, client: getItemBy(clients, r.clientname, 'name')?.ref })), ({ clientname }) => clientname)
		const [dupes, fresh] = partition(toAdd, findReceipt(rec))

		const newReceiptRef = newRef([conf, null, confSetKey])('recpre', 'recnext')

		const newReceipt = ({ date = today(), clientname = '', invoice, total = 0 } = {}, i) => ({
			id: uuid(),
			ref: newReceiptRef(),
			date,
			client: clients.find(c => c.name === clientname).ref,
			invoice,
			total,
		})

		setrec(rec.concat(fresh.map(newReceipt)))

		clientsSet(toAdd.reduce((clients, { clientname, pattern }) => {
			const c = getItemBy(clients, clientname, 'name')
			const patterns = unique((c.patterns || '').split('\n').concat(pattern)).join('\n')
			const newc = { ...c, patterns }
			return replaceItemById(clients, newc)
		}, clients))

		ignoretxtSet(unique(ignorelist.concat(toReject.map(({ pattern }) => pattern))).join('\n'))

		settxt('')
		setreceipts([])
		msgSet(`${fresh.length} added. ${dupes.length} duplicated. ${toReject.length} discarded.`)
	}

	return (<>
		<Alert show={!!msg} variant='success'>{msg}</Alert>
		<p>Access a bank statement, press Ctrl+A, press Ctrl+C, then return here and click in the box below, press Ctrl+V.</p>
		<Form>
			<TextArea label='Bank statement' txt={[txt, settxt]} />
		</Form>
		<Table name='Statements' schema={{
			clientname: ColumnRef('Client', { all: clients, colRef: 'name', colView: 'ref', colDisplay: 'name' }),
			create: ColumnButton('Create', (_, row) => addClient(row), (val, { clientname }) => clientname && !getItemBy(clients, clientname, 'name') ? ('Create ' + clientname) : ''),
			invoice: ColumnRef('Invoice', { all: invoices, colRef: 'ref', colView: 'total', colDisplay: 'ref' }),
			date: ColumnText('Date'),
			desc: ColumnText('Desc'),
			total: ColumnText('In/Out'),
			balance: ColumnText('Balance'),
			match: ColumnText('Match'),
			pattern: ColumnText('Pattern'),
		}} rows={[receipts, setreceipts]} newRow={() => ({ id: uuid() })} addDel={true} inlineHeadersEdit={false} />
		<Button data-testid='buttonAddAll' onClick={onAddAll}>Add All to Receipts</Button>
		<p className="mt-3">Any rows with blank Client will be deleted. Discarded rows are added to ignore patterns.</p>
		<p>Any rows already in Receipts (with same Client, Date and In/Out) are duplicates. They will not be added again.</p>
		<Form>
			<TextArea label='Ignore patterns' txt={[ignoretxt, ignoretxtSet]} />
		</Form>
	</>)
}

DetectReceipts.propTypes = {
	stClients: PropTypes.array.isRequired,
	stInvoices: PropTypes.array.isRequired,
	stReceipts: PropTypes.array.isRequired,
	stSettings: PropTypes.array.isRequired,
	newClientId: PropTypes.func.isRequired,
}

export default DetectReceipts
