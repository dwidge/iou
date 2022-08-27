import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
	MemoryRouter,
} from 'react-router-dom'
// import { debug } from 'jest-preview';

import * as J from '@dwidge/lib-react'

import App from '../App'

const clear = J.clear(userEvent, screen)
const type = J.type(userEvent, screen)
const click = J.click(userEvent, screen)
const input = async (id, text) => {
	await clear(id)
	await type(id, text)
}
const snap = id =>
	expect(screen.getByTestId(id)).toMatchSnapshot()

jest.mock('@dwidge/lib', () => ({
	...jest.requireActual('@dwidge/lib'),
	uuid: ((value = 10) => () => String(++value))(),
}))
afterEach(() => {
	jest.restoreAllMocks()
})

describe('Bank', () => {
	test('renders page', () => {
		render(<MemoryRouter initialEntries={['/statements']}>
			<App />
		</MemoryRouter>)

		snap('tableStatements')
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
		snap('route/bank')
		await click('buttonEdit146')
		await input('inputViewClient', 'clientB')
		await click('buttonSave')
		await click('buttonAddAll')
		snap('route/bank')
		await click('nav/receipts')
		snap('route/receipts')
		await click('nav/clients')
		snap('route/clients')
	})
})
