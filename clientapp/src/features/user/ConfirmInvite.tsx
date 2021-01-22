import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import agent from "../../app/api/agent";
import { Header, Icon, Segment } from "semantic-ui-react";
import CreatePasswordForm from "./CreatePasswordForm";

const ConfirmInvite = (props: RouteComponentProps<{}>) => {
  const Status = {
    Verifying: "Verifying",
    Success: "Success",
    Failed: "Failed",
  };

  const [status, setStatus] = useState(Status.Verifying);
  const { token, email } = queryString.parse(props.location.search);

  useEffect(() => {
    agent.User.confirmInvite(token as string, email as string)
      .then(() => {
        setStatus(Status.Success);
      })
      .catch(() => {
        setStatus(Status.Failed);
      });
  }, [Status.Success, Status.Failed, token, email]);

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>;
      case Status.Failed:
        return (
          <div className="center">
            <p>User invitation verification failed. The invite token is no longer valid or has been revoked.</p>
          </div>
        );
      case Status.Success:
        return (
          <div className="center">
            <p>Invite verification successful - please complete the process by creating an account password below:</p>
            <CreatePasswordForm {...props} />
          </div>
        );
    }
  };

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="envelope" />
        Invite Verification
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
};

export default ConfirmInvite;
