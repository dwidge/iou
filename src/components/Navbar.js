import React from 'react'
import PropTypes from 'prop-types'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import {
	Routes,
	Route,
	NavLink,
	useLocation,
} from 'react-router-dom'

const Pages = ({ brand, pages, pagesArray = Object.entries(pages) }) => (
	<>
		<PagesNav brand={brand} pagesArray={pagesArray}/>
		<PagesContent pagesArray={pagesArray}/>
	</>
)

const PagesNav = ({ brand, pagesArray }) => (
	<Navbar bg="light" expand="lg">
		<Container>
			<Navbar.Brand href="#home">{brand}{useLocation().pathname}</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav variant="pills" as='ul'>
					{pagesArray.map(([path, { name }]) =>
						(
							<Nav.Item as='li' key={path} >
								<Nav.Link as={NavLink} to={path}>{name}</Nav.Link>
							</Nav.Item>))}
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>
)

const PagesContent = ({ pagesArray }) => (
	<>
		<div className="page">
			<Routes>
				{pagesArray.map(([path, { element }]) =>
					(<Route key={path} path={path} element={element}/>),
				)}
				<Route path='/' />
			</Routes>
		</div>
	</>
)

Pages.propTypes = {
	brand: PropTypes.string.isRequired,
	pages: PropTypes.object,
	pagesArray: PropTypes.array,
}
PagesNav.propTypes = {
	brand: PropTypes.string.isRequired,
	pagesArray: PropTypes.array.isRequired,
}
PagesContent.propTypes = {
	pagesArray: PropTypes.array.isRequired,
}

export default Pages
