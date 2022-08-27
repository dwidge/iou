import React, { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
	MemoryRouter,
} from 'react-router-dom'

import * as J from '@dwidge/lib-react'

import App from '../App'
import Clients from '../components/Clients'
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

		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
	})

	it('enters into list', async () => {
		const Page = () => (<Clients stClients={useState([])}/>)
		render(<Page/>)
		click('buttonAdd')
		await input('inputName', 'clientB')
		await input('inputPhone', '0005551112')
		click('buttonSave')
		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
	})

	it('enters another into list', async () => {
		const Page = () => (<Clients stClients={useState([client1])}/>)
		render(<Page/>)
		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
		click('buttonAdd')
		await input('inputName', 'clientC')
		await input('inputPhone', '0005551113')
		click('buttonSave')
		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
	})

	it('confirms & clears list', async () => {
		const Page = () => (<Clients stClients={useState([client1])}/>)
		render(<Page/>)
		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
		expect(text('buttonClear')).toEqual('Clear')
		click('buttonClear')
		expect(text('buttonClear')).toEqual('Confirm')
		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
		click('buttonClear')
		expect(text('buttonClear')).toEqual('Clear')
		expect(screen.getByTestId('tableClients')).toMatchSnapshot()
	})
})

describe('Invoices', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/invoices']}>
			<App />
		</MemoryRouter>)

		expect(screen.getByTestId('tableInvoices')).toMatchSnapshot()
	})
})

describe('Receipts', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/receipts']}>
			<App />
		</MemoryRouter>)

		expect(screen.getByTestId('tableReceipts')).toMatchSnapshot()
	})
})

describe('Statements', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/statements']}>
			<App />
		</MemoryRouter>)

		expect(screen.getByTestId('tableStatements')).toMatchSnapshot()
	})
})

describe('Settings', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/settings']}>
			<App />
		</MemoryRouter>)

		expect(screen.getByTestId('tableSettings')).toMatchSnapshot()
	})
})
