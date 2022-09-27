import React from 'react'
import PropTypes from 'prop-types'
import { onChange } from '@dwidge/lib-react'
import Form from 'react-bootstrap/Form'
import { DebounceInput } from 'react-debounce-input'

const TextArea = ({ label, txt: [txt, settxt], placeholder }) => (
	<Form.Group className="mb-3">
		<Form.Label>{label}</Form.Label>
		<DebounceInput
			debounceTimeout={500}
			element={Form.Control}
			as="textarea"
			placeholder={placeholder}
			rows={5} onChange={onChange(settxt)} value={txt} data-testid={'input' + label} />
	</Form.Group>
)

TextArea.propTypes = {
	label: PropTypes.string.isRequired,
	txt: PropTypes.array.isRequired,
	placeholder: PropTypes.string,
}

export default TextArea
