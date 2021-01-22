import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Grid, Header, Icon, Menu, Segment } from "semantic-ui-react";
import { search } from "../../app/common/utils/search";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { IProfile } from "../../app/models/profile";
import { RootStoreContext } from "../../app/stores/rootStore";
import InviteUserForm from "./InviteUserForm";
import UsersTable from "./UsersTable";

const UsersPage = () => {
  const rootStore = useContext(RootStoreContext);
  const { getUsers, getRoles, roleSelectOptions, profilesOrderedAscending, loadingRoles, loadingProfile } = rootStore.userStore;
  const { loadCompanies, companySelectOptions, loadingCompanies } = rootStore.companyStore;

  useEffect(() => {
    getRoles();
    getUsers();
    loadCompanies();
  }, [getRoles, getUsers, loadCompanies]);

  const [users, setUsers] = useState<IProfile[]>(
    profilesOrderedAscending.filter((user) => {
      return user.isActive === true;
    })
  );

  useEffect(() => {
    setUsers(
      profilesOrderedAscending.filter((user) => {
        return user.isActive === true;
      })
    );
  }, [profilesOrderedAscending]);

  const [showInviteForm, setShowInviteForm] = useState(false);

  const [showInactiveUsers, setShowInactiveUsers] = useState(true);

  const toggleForm = () => setShowInviteForm(!showInviteForm);
  const [query, setQuery] = useState("");

  function showOnlyActiveUsers(userList: IProfile[]): IProfile[] {
    return userList.filter((user) => {
      return user.isActive === true;
    });
  }

  const toggleInactiveUsers = () => {
    setShowInactiveUsers(!showInactiveUsers);
    if (showInactiveUsers) {
      setUsers(profilesOrderedAscending);
    } else {
      setUsers(showOnlyActiveUsers(profilesOrderedAscending));
    }
  };

  if (loadingProfile || loadingRoles || loadingCompanies) return <LoadingComponent content="Loading users..." />;

  return (
    <>
      <Segment>
        <Grid>
          <Grid.Column width={16}>
            <Header as="h2">
              <Icon name="users" />
              <Header.Content>
                Users
                <Header.Subheader>Manage and invite application users</Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
      <div>
        <Menu attached="top" stackable>
          <Menu.Item onClick={toggleForm} style={showInviteForm ? { backgroundColor: "red", color: "#FFF", fontWeight: "bold" } : null}>
            {showInviteForm ? <Icon name="times" /> : <Icon name="envelope" />}
            {showInviteForm ? "Cancel" : "Invite User"}
          </Menu.Item>
          <Menu.Item onClick={toggleInactiveUsers}>
            <Icon name="filter" />
            {showInactiveUsers ? "Show Inactive Users" : "Hide Inactive Users"}
          </Menu.Item>
          <Menu.Menu position="right">
            <div className="ui right aligned category search item">
              <div className="ui transparent icon input">
                <input className="prompt" type="text" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <i className="search link icon" />
              </div>
              <div className="results" />
            </div>
          </Menu.Menu>
        </Menu>
        {showInviteForm && (
          <Segment attached>
            <InviteUserForm roleOptions={roleSelectOptions} companyOptions={companySelectOptions} />
          </Segment>
        )}
        <Segment attached="bottom">
          {(users[0] && <UsersTable users={users.filter((user) => search<IProfile>(user, ["firstName", "lastName", "email", "companyName", "contactPhoneNumber", "role"], query))} />) || (
            <p>NO DATA</p>
          )}
        </Segment>
      </div>
    </>
  );
};

export default observer(UsersPage);
