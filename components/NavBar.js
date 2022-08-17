import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

import styles from './styles/NavBar.module.css';

function NavBar({ timerPhase }) {
  const projectNames = [
    'Bar Chart',
    'Scatterplot Graph',
    'Heat Map',
    'Choropleth Map',
    'Treemap Diagram',
  ];

  const fccProjectLinks = projectNames.map((name, index) => {
    return (
      <NavDropdown.Item
        key={name}
        href={`https://plcoster.github.io/fcc_frontendlibs_project${index}/`}
      >
        {name}
      </NavDropdown.Item>
    );
  });

  return (
    <Navbar
      variant="dark"
      expand="md"
      className={`${styles.navbar} ${
        timerPhase === 'Session' ? styles.onSession : styles.onBreak
      }`}
    >
      <Container fluid>
        <Navbar.Brand href="#home" className={styles.navbarBrand}>
          Treemap Diagram
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://plcoster.github.io/homepage/">
              Home
            </Nav.Link>
            <NavDropdown title="FreeCodeCamp Projects" id="basic-nav-dropdown">
              {fccProjectLinks}
            </NavDropdown>
            <Nav.Link href="https://plcoster.github.io/homepage/projects.html">
              All Projects
            </Nav.Link>
            <Nav.Link href="https://github.com/PLCoster">
              <i className="bi bi-github"></i> Github
            </Nav.Link>
            <Nav.Link href="https://linkedin.com/in/plcoster">
              <i className="bi bi-linkedin"></i> LinkedIn
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
