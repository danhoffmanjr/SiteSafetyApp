import React, { useContext, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import queryString from "query-string";
import agent from "../../app/api/agent";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { toast } from "react-toastify";

const ConfirmEmail: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const Status = {
    Verifying: "Verifying",
    Success: "Success",
    Failed: "Failed",
  };

  const [status, setStatus] = useState(Status.Verifying);
  const { openModal } = rootStore.modalStore;
  const { token, email } = queryString.parse(location.search);

  useEffect(() => {
    agent.User.confirmEmail(token as string, email as string)
      .then(() => {
        setStatus(Status.Success);
      })
      .catch(() => {
        setStatus(Status.Failed);
      });
  }, [Status.Success, Status.Failed, token, email]);

  const handleConfirmEmailResend = () => {
    agent.User.confirmEmailResend(email as string)
      .then(() => {
        toast.success("Verification email resent - please check your email");
      })
      .catch((error) => console.error(error));
  };

  const getBody = () => {
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>;
      case Status.Failed:
        return (
          <div className="center">
            <p>Email verification failed - you can try resending the verification link.</p>
            <Button onClick={handleConfirmEmailResend} primary size="huge" content="Resend" />
          </div>
        );
      case Status.Success:
        return (
          <div className="center">
            <p>Email verification successful - you can now login.</p>
            <Button primary size="huge" tag={Link} to="/login" content="Login" />
          </div>
        );
    }
  };

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="envelope" />
        Email Verification
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
};

export default ConfirmEmail;
