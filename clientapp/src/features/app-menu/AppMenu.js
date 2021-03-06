import React, { useContext, useState, useEffect } from "react";
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Container } from "reactstrap";
import { Link, NavLink as link, useHistory, useLocation } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import "./app-menu.css";
import { observer } from "mobx-react-lite";
import { Item, Dropdown, Label, Icon } from "semantic-ui-react";

const AppMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportsLink, setIsReportsLink] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    let segment = location.pathname.split("/")[1];
    setIsReportsLink(segment === "reports" || segment === "report-types");
  }, [location]);

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3 navbar-dark navbar-custom" light>
        <Container>
          <NavbarBrand tag={Link} to="/">
            Pike Safety
          </NavbarBrand>
          {user && (
            <Item.Group>
              <Label image>
                <Icon name="user" />
                <Dropdown pointing="top left" text={`${user.firstName}`}>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/profiles/${user.email}`} text="My profile" icon="user" />
                    <Dropdown.Item onClick={logout} text="Logout" icon="sign-out" />
                  </Dropdown.Menu>
                </Dropdown>
              </Label>
            </Item.Group>
          )}
          <NavbarToggler onClick={toggle} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={isOpen} navbar>
            {user && (
              <>
                <ul className="navbar-nav flex-grow">
                  <NavItem>
                    <NavLink active={isReportsLink}>
                      <Dropdown text="Reports">
                        <Dropdown.Menu>
                          <Dropdown.Item text="Reports" onClick={() => history.push("/reports")} />
                          <Dropdown.Item text="Report Types" onClick={() => history.push("/report-types")} />
                        </Dropdown.Menu>
                      </Dropdown>
                    </NavLink>
                  </NavItem>
                  {user.role.privilegeLevel >= 50 && (
                    <>
                      <NavItem>
                        <NavLink tag={link} to="/companies">
                          Companies
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag={link} to="/sites">
                          Sites
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink tag={link} to="/users">
                          Users
                        </NavLink>
                      </NavItem>
                    </>
                  )}
                </ul>
              </>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default observer(AppMenu);
