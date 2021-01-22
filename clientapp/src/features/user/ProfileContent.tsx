import React, { Fragment } from "react";
import { Header, List, Tab } from "semantic-ui-react";
import { IProfile } from "../../app/models/profile";
import ProfilePasswordReset from "./ProfilePasswordReset";
import ProfileDetails from "./ProfileDetails";

interface IProps {
  profile: IProfile;
}

const ProfileContent: React.FC<IProps> = ({ profile }) => {
  const styles = {
    name: {
      display: "inline-block",
      width: "35%",
    },
    address: {
      display: "inline-block",
      marginLeft: "1rem",
    },
  };

  const panes = [
    { menuItem: "My Data", render: () => <ProfileDetails profile={profile} /> },
    {
      menuItem: "My Sites",
      render: () => (
        <Tab.Pane>
          {profile.sites && profile.sites.length > 0 ? (
            <Fragment>
              <Header as="h4">Sites Assigned To:</Header>
              <List celled ordered>
                {profile.sites.map((site) => {
                  return (
                    <List.Item>
                      <span>
                        <strong style={styles.name}>{site.name} </strong>
                        <em style={styles.address}>{site.address}</em>
                      </span>
                    </List.Item>
                  );
                })}
              </List>
            </Fragment>
          ) : (
            "No sites assigned."
          )}
        </Tab.Pane>
      ),
    },
    {
      menuItem: "My Reports",
      render: () => (
        <Tab.Pane>
          {profile.reports && profile.reports.length > 0 ? (
            <Fragment>
              <Header as="h4">Reports:</Header>
              <List celled ordered>
                {profile.reports.map((report) => {
                  return <List.Item>{report.title}</List.Item>;
                })}
              </List>
            </Fragment>
          ) : (
            "No reports."
          )}
        </Tab.Pane>
      ),
    },
    { menuItem: "Reset Password", render: () => <ProfilePasswordReset email={profile.email} /> },
  ];

  return <Tab menu={{ fluid: true, vertical: true }} menuPosition="right" panes={panes} />;
};

export default ProfileContent;
