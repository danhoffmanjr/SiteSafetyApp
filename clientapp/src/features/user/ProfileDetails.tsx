import React, { useState } from "react";
import { Tab, Grid, Header, Button, List, Label, Icon } from "semantic-ui-react";
import { IProfile } from "../../app/models/profile";
import EditProfileForm from "./EditProfileForm";

interface IProps {
  profile: IProfile;
}

const ProfileDetails: React.FC<IProps> = ({ profile }) => {
  const [editMode, setEditMode] = useState(false);

  const styles = {
    em: {
      display: "inline-block",
      width: "7rem",
    },
  };

  return (
    <Tab.Pane>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header floated="left" content={`Personal Data`} />
            <Button floated="right" basic content={editMode ? "Cancel" : "Edit Profile"} onClick={() => setEditMode(!editMode)} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            {editMode ? (
              <EditProfileForm profile={profile} />
            ) : (
              <List celled>
                <List.Item>
                  <span>
                    <Icon name="user circle" />
                    <em style={styles.em}>First Name: </em>
                    <strong>{profile?.firstName}</strong>
                  </span>
                </List.Item>
                <List.Item>
                  <span>
                    <Icon name="user circle" />
                    <em style={styles.em}>Last Name: </em>
                    <strong>{profile?.lastName}</strong>
                  </span>
                </List.Item>
                <List.Item>
                  <span>
                    <Icon name="mail" />
                    <em style={styles.em}>Email: </em>
                    <strong>{profile?.email}</strong>
                  </span>
                </List.Item>
                <List.Item>
                  <span>
                    <Icon name="phone" />
                    <em style={styles.em}>Contact Phone: </em>
                    <strong>{profile?.contactPhoneNumber}</strong>
                  </span>
                </List.Item>
                <List.Item>
                  <span>
                    <Icon name="industry" />
                    <em style={styles.em}>Company: </em>
                    <strong>{profile?.companyName}</strong>
                  </span>
                </List.Item>
                <List.Item>
                  <span>
                    <Icon name="cog" />
                    <em style={styles.em}>Role: </em>
                    <strong>{profile?.role}</strong>
                  </span>
                </List.Item>
              </List>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileDetails;
