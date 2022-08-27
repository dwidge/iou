import React from 'react'
import PropTypes from 'prop-types'
import { onChange } from '@dwidge/lib-react'

import Form from 'react-bootstrap/Form'

const TextArea = ({ label, txt: [txt, settxt] }) => (
	<Form.Group className="mb-3">
		<Form.Label>{label}</Form.Label>
		<Form.Control as="textarea" rows={5} onChange={onChange(settxt)} value={txt} data-testid={'input' + label} />
	</Form.Group>
)

TextArea.propTypes = {
	label: PropTypes.string.isRequired,
	txt: PropTypes.array.isRequired,
}

export default TextArea