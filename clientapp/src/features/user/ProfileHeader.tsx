import React from "react";
import { Segment, Header, Grid, Icon, Label } from "semantic-ui-react";
import { IProfile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";

interface IProps {
  profile: IProfile;
}

const ProfileHeader: React.FC<IProps> = ({ profile }) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={16}>
          <Header as="h2">
            <Icon name="user" />
            <Header.Content>
              {`${profile.firstName} ${profile.lastName}`}{" "}
              {profile.role === "Admin" && (
                <Label color="teal" horizontal>
                  {profile.role}
                </Label>
              )}
              <Header.Subheader>Manage your personal data and account settings</Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default observer(ProfileHeader);
