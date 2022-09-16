import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { button } from './gapi'

const GoogleId = ({ children }) => {
	const [user, userSet] = useState()
	return (<>
		<SignInButton onSignIn={userSet} />
		<SignedIn user={user}>{children}</SignedIn>
	</>)
}
GoogleId.propTypes = {
	children: PropTypes.array,
}

const SignedIn = ({ children, user }) => {
	if (user) {
		return (<>
			<p>Signed in as {user.payload.email}</p>
			{children}
		</>)
	}
}
SignedIn.propTypes = {
	user: PropTypes.object,
	children: PropTypes.array,
}

const SignInButton = ({ onSignIn }) => {
	useEffect(() => {
		button('googleId').then(u => onSignIn(u))
	}, [])
	return (<div className="mb-3" id="googleId"></div>)
}
SignInButton.propTypes = {
	onSignIn: PropTypes.func.isRequired,
	children: PropTypes.array,
}

export default GoogleId
