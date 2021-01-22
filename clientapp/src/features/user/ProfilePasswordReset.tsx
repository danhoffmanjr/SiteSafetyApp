import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Grid, Tab } from "semantic-ui-react";
import agent from "../../app/api/agent";

interface IProps {
  email: string;
}

const ProfilePasswordReset: React.FC<IProps> = ({ email }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordReset = () => {
    setIsSubmitting(true);
    agent.User.forgotPassword(email as string)
      .then(() => {
        setIsSubmitting(false);
        toast.success("Password reset link sent - please check your email");
      })
      .catch((error) => {
        console.error(error);
        setIsSubmitting(false);
        toast.error(`Problem sending Password reset link. Error: ${error.request.response}`);
      });
  };

  return (
    <Tab.Pane>
      <Grid padded>
        <Grid.Row>
          <Grid.Column width={16}>
            <p>Click to send a password reset link to your email.</p> <Button primary onClick={handlePasswordReset} content="Send Link" loading={isSubmitting} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfilePasswordReset;
