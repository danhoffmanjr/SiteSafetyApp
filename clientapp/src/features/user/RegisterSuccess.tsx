import React from "react";
import { RouteComponentProps } from "react-router-dom";
import queryString from "query-string";
import { Header, Icon, Segment, Button } from "semantic-ui-react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

const RegisterSuccess: React.FC<RouteComponentProps> = ({ location }) => {
  const { email } = queryString.parse(location.search);
  
  const handleConfirmEmailResend = () => {
    agent.User.confirmEmailResend(email as string)
      .then(() => {
        toast.success("Verification email resent - please check your email");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="check" />
        Registration Successful!
      </Header>
      <Segment.Inline>
        <div className="center" style={{textAlign: "center"}}>
          <p>Please check your email for the verification link.</p>
          {email && (
            <>
              <p>Didn't receive the email? Just click the resend button below.</p>
              <Button onClick={handleConfirmEmailResend} primary content="Resend" size="huge" />
            </>
          )}
        </div>
      </Segment.Inline>
    </Segment>
  );
};

export default RegisterSuccess;
