import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as J from '@dwidge/lib-react'

import React, { useState } from 'react'
import {
	MemoryRouter,
} from 'react-router-dom'
import App from '../App'
import Clients from '../components/Clients'
const tid = id => screen.getByTestId(id)
const text = J.tools(userEvent, screen, jest).text
const clear = J.clear(userEvent, screen)
const type = J.type(userEvent, screen)
const click = J.click(userEvent, screen)
const input = async (id, text) => {
	await clear(id)
	await type(id, text)
}

jest.mock('@dwidge/lib', () => ({
	...jest.requireActual('@dwidge/lib'),
	uuid: ((value = 10) => () => String(++value))(),
}))
afterEach(() => {
	jest.restoreAllMocks()
})

describe('Clients', () => {
	const client1 = { id: 1, name: 'clientA', phone: '1235551234' }

	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/clients']}>
			<App />
		</MemoryRouter>)

		expect(tid('tableClients')).toMatchSnapshot()
	})

	it('enters into list', async () => {
		const Page = () => (<Clients stClients={useState([])}/>)
		render(<Page/>)
		await click('buttonAdd')
		await input('inputName', 'clientB')
		await input('inputPhone', '0005551112')
		await click('buttonSave')
		expect(tid('tableClients')).toMatchSnapshot()
	})

	it('enters another into list', async () => {
		const Page = () => (<Clients stClients={useState([client1])}/>)
		render(<Page/>)
		expect(tid('tableClients')).toMatchSnapshot()
		await click('buttonAdd')
		await input('inputName', 'clientC')
		await input('inputPhone', '0005551113')
		await click('buttonSave')
		expect(tid('tableClients')).toMatchSnapshot()
	})

	it('confirms & clears list', async () => {
		const Page = () => (<Clients stClients={useState([client1])}/>)
		render(<Page/>)
		expect(tid('tableClients')).toMatchSnapshot()
		expect(text('buttonClear')).toEqual('Clear')
		await click('buttonClear')
		expect(text('buttonClear')).toEqual('Confirm')
		expect(tid('tableClients')).toMatchSnapshot()
		await click('buttonClear')
		expect(text('buttonClear')).toEqual('Clear')
		expect(tid('tableClients')).toMatchSnapshot()
	})
})

describe('Invoices', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/invoices']}>
			<App />
		</MemoryRouter>)

		expect(tid('tableInvoices')).toMatchSnapshot()
	})
})

describe('Receipts', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/receipts']}>
			<App />
		</MemoryRouter>)

		expect(tid('tableReceipts')).toMatchSnapshot()
	})
})

describe('Statements', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/statements']}>
			<App />
		</MemoryRouter>)

		expect(tid('tableStatements')).toMatchSnapshot()
	})
})

describe('Settings', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/settings']}>
			<App />
		</MemoryRouter>)

		expect(tid('tableSettings')).toMatchSnapshot()
	})
})
