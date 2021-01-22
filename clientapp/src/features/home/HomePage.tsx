import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { Jumbotron, Button } from "reactstrap";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { history } from "../..";

const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { logout, user, loadingUser } = rootStore.userStore;
  const token = localStorage.getItem("ps-token");

  if (loadingUser) return <LoadingComponent content={`Loading Home Page...`} />;

  return (
    <Jumbotron>
      {(user && token && (
        <Fragment>
          <h1 className="display-3">Welcome, {user.firstName}</h1>
          <p className="lead">The Pike Safety App. An app for creating and managing site safety reports.</p>
          <hr className="my-2" />
          <p className="lead">
            <Button
              className="mx-2"
              color="primary"
              onClick={() => {
                history.push("/reports/manage");
              }}
            >
              My Reports
            </Button>
            <Button color="danger" onClick={logout}>
              Logout
            </Button>
          </p>
        </Fragment>
      )) || (
        <Fragment>
          <h1 className="display-3">Welcome</h1>
          <p className="lead">The Pike Safety App. An app for creating and managing site safety reports.</p>
          <hr className="my-2" />
          <p>Please login to your account.</p>
          <p className="lead">
            <Button color="primary" tag={Link} to="/login">
              Login
            </Button>
            {/* <Button tag={Link} color="secondary" to="/register" className="mx-2">
              Register
            </Button> */}
          </p>
        </Fragment>
      )}
    </Jumbotron>
  );
};

export default observer(HomePage);
