import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from "antd";
import { Home } from "./components/Home";
import { ViewApplicant } from "./components/ViewApplicant";
import { AddApplicant } from "./components/AddApplicant";
import { EditApplicant } from "./components/EditApplicant";

const { Header } = Layout;

function App() {
  return (
    <div style={{ margin: "auto", overflowX: "hidden" }}>
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
          <Route path="/view/:id" component={ViewApplicant} />
          <Route path="/add" component={AddApplicant} />
          <Route path="/edit/:id" component={EditApplicant} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
