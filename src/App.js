import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Home from "./components/Home";
import AddApplicant from "./components/AddApplicant";
import ViewAndEditApplicant from "./components/ViewAndEditApplicant";

const client = new ApolloClient({
  uri: "http://applicant-manager-api.herokuapp.com/playground",
});

function App() {
  return (
    <div style={{ margin: "auto", overflowX: "hidden" }}>
      <ApolloProvider client={client}>
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(315deg,#6225DE,#945FFF)",
            padding: 20,
            marginBottom: 10,
          }}
        >
          <h1 style={{ padding: 0, margin: 0, color: "white" }}>
            Applicants Manager
          </h1>
        </div>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/add" component={AddApplicant} />
            <Route path="/applicant/:id" component={ViewAndEditApplicant} />
          </Switch>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
