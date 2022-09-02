import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// import { debug } from 'jest-preview';

import * as J from '@dwidge/lib-react'

import React from 'react'
import {
	MemoryRouter,
} from 'react-router-dom'
import App from '../App'
const tid = id => screen.getByTestId(id)
const clear = J.clear(userEvent, screen)
const type = J.type(userEvent, screen)
const click = J.click(userEvent, screen)
const input = async (id, text) => {
	await clear(id)
	await type(id, text)
	act(jest.runOnlyPendingTimers)
}

jest.mock('@dwidge/lib', () => ({
	...jest.requireActual('@dwidge/lib'),
	uuid: ((value = 10) => () => String(++value))(),
}))
afterEach(() => {
	jest.restoreAllMocks()
})
beforeAll(() => {
	jest.useFakeTimers()
})
afterAll(() => {
	jest.useRealTimers()
})

describe('Bank', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/statements']}>
			<App />
		</MemoryRouter>)

		expect(tid('tableStatements')).toMatchSnapshot()
	})

	test('detects patterns', async () => {
		render(<MemoryRouter initialEntries={['/clients']}>
			<App />
		</MemoryRouter>)

		await click('buttonAdd')
		await input('inputName', 'clientA')
		await input('inputPatterns', 'dd')
		await click('buttonSave')
		await click('buttonAdd')
		await input('inputName', 'clientB')
		await click('buttonSave')
		await click('nav/bank')
		await input('inputBank statement', `
22/33/4444 dd 8.8 * 1,109,999.99
22/33/4444 dd 7.7 * 999.99
11/22/3333 aa 4 bb 5.5 cc 6.66 7.77
`)
		expect(tid('route/bank')).toMatchSnapshot()
		await click('buttonEdit14')
		await input('inputClient', 'clientB')
		await click('buttonSave')
		await click('buttonAddAll')
		expect(tid('route/bank')).toMatchSnapshot()
		await click('nav/receipts')
		expect(tid('route/receipts')).toMatchSnapshot()
		await click('nav/clients')
		expect(tid('route/clients')).toMatchSnapshot()
	})
})
