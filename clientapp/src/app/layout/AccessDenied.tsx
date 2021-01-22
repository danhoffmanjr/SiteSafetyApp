import React, { useContext } from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";

const AccessDenied = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, logout } = rootStore.userStore;
  console.log("Is Logged In: ", isLoggedIn);
  return (
    <Segment placeholder>
      <Header as="h2" color="red" textAlign="center">
        <Header.Content>
          <Icon name="exclamation" /> Oops - Access Denied!
        </Header.Content>
      </Header>
      <Segment.Inline>
        {isLoggedIn && (
          <Button as={Link} to="/manage" primary basic>
            My Reports
          </Button>
        )}
        {(!isLoggedIn && <Button as={Link} to="/login" content="Login" primary inverted />) || <Button onClick={logout} content="Logout" color="red" inverted />}
      </Segment.Inline>
    </Segment>
  );
};

export default observer(AccessDenied);
