import React, { useState } from "react";
import { graphql } from "react-apollo";
import { flowRight as compose } from "lodash";

import {
  moveApplicantMutation,
  deleteApplicantMutation,
  saveOrRejectApplicantMutation,
} from "../graphql/mutations";
import { getApplicantsQuery } from "../graphql/queries";

import { Link } from "react-router-dom";
import {
  Avatar,
  Empty,
  Row,
  Col,
  Dropdown,
  Spin,
  Button,
  Modal,
  Menu,
  message,
  Tabs,
  List,
  Space,
} from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  EditFilled,
  ForwardOutlined,
  SyncOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import "./Home.css";

const { TabPane } = Tabs;

const Home = (props) => {
  const [tabKey, setTabKey] = useState("All");
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteConfirmModal, showDeleteConfirmModal] = useState(false);

  const allApplicantsData = props.getApplicantsQuery.getApplicants;

  let applicantsData = [];

  console.log("LOADING", props.getApplicantsQuery);

  const allCount =
    props.getApplicantsQuery &&
    props.getApplicantsQuery.getApplicants &&
    props.getApplicantsQuery.getApplicants.length;

  const pendingCount =
    (allApplicantsData &&
      allApplicantsData.filter((applicant) => applicant.status === "pending")
        .length) ||
    0;
  const savedCount =
    (allApplicantsData &&
      allApplicantsData.filter((applicant) => applicant.status === "saved")
        .length) ||
    0;
  const rejectedCount =
    (allApplicantsData &&
      allApplicantsData.filter((applicant) => applicant.status === "rejected")
        .length) ||
    0;
  const selectionsCount =
    (allApplicantsData &&
      allApplicantsData
        .filter((applicant) => applicant.status !== "rejected")
        .filter((applicant) => applicant.status !== "pending")
        .filter((applicant) => applicant.category === "selections").length) ||
    0;
  const backupsCount =
    (allApplicantsData &&
      allApplicantsData
        .filter((applicant) => applicant.status !== "rejected")
        .filter((applicant) => applicant.status !== "pending")
        .filter((applicant) => applicant.category === "backups").length) ||
    0;
  const recosCount =
    (allApplicantsData &&
      allApplicantsData
        .filter((applicant) => applicant.status !== "rejected")
        .filter((applicant) => applicant.status !== "pending")
        .filter((applicant) => applicant.category === "recos").length) ||
    0;

  switch (tabKey) {
    case "All":
      applicantsData = allApplicantsData;
      break;

    case "Pending":
      applicantsData = allApplicantsData.filter(
        (applicant) => applicant.status === "pending"
      );
      break;

    case "Saved":
      applicantsData = allApplicantsData.filter(
        (applicant) => applicant.status === "saved"
      );
      break;

    case "Rejected":
      applicantsData = allApplicantsData.filter(
        (applicant) => applicant.status === "rejected"
      );
      break;

    case "Selections":
      applicantsData = allApplicantsData
        .filter((applicant) => applicant.status !== "rejected")
        .filter((applicant) => applicant.status !== "pending")
        .filter((applicant) => applicant.category === "selections");
      break;

    case "Backups":
      applicantsData = allApplicantsData
        .filter((applicant) => applicant.status !== "rejected")
        .filter((applicant) => applicant.status !== "pending")
        .filter((applicant) => applicant.category === "backups");
      break;

    case "Recos":
      applicantsData = allApplicantsData
        .filter((applicant) => applicant.status !== "rejected")
        .filter((applicant) => applicant.status !== "pending")
        .filter((applicant) => applicant.category === "recos");
      break;

    default:
      break;
  }

  // console.log("APPLICANTS", applicantsData);

  const IconText = ({ icon, text, id }) =>
    text === "Delete" ? (
      <Space
        onClick={() => {
          showDeleteConfirmModal(true);
          setSelectedRow(id);
        }}
      >
        <a href="#">
          {React.createElement(icon)}
          {text}
        </a>
      </Space>
    ) : (
      <Space>
        {React.createElement(icon)}
        {text}
      </Space>
    );

  const btnDeleteApplicant = () => {
    showDeleteConfirmModal(false);

    let deleteApplicant = {
      id: selectedRow,
    };
    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === selectedRow);

    props.deleteApplicantMutation({
      variables: deleteApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });

    message.success(
      `${findApplicant && findApplicant.name} has now been deleted!`
    );
  };

  const btnSaveApplicant = async (e) => {
    e.preventDefault();

    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === e.target.id);

    let saveApplicant = {
      id: e.target.id.toString(),
      status: "saved",
    };

    await props.saveOrRejectApplicantMutation({
      variables: saveApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });

    await message.success(
      `${findApplicant && findApplicant.name}'s application has been saved!`
    );
  };

  const btnRejectApplicant = async (e) => {
    e.preventDefault();

    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === e.target.id);

    let rejectApplicant = {
      id: e.target.id.toString(),
      status: "rejected",
    };

    await props.saveOrRejectApplicantMutation({
      variables: rejectApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });

    await message.success(
      `${findApplicant && findApplicant.name}'s application has been rejected!`
    );
  };

  const btnMoveToPending = async (e) => {
    e.preventDefault();

    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === e.target.id);

    let moveApplicant = {
      id: e.target.id.toString(),
      status: "pending",
    };

    await props.saveOrRejectApplicantMutation({
      variables: moveApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });

    await message.success(
      `${findApplicant && findApplicant.name} has now been moved to Pending!`
    );
  };

  const btnMoveToSelections = async (e) => {
    e.preventDefault();

    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === e.target.id);

    let moveApplicant = {
      id: e.target.id.toString(),
      category: "selections",
    };

    await props.moveApplicantMutation({
      variables: moveApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });

    await message.success(
      `${findApplicant && findApplicant.name} has now been moved to Selections!`
    );
  };

  const btnMoveToBackups = async (e) => {
    e.preventDefault();

    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === e.target.id);

    let moveApplicant = {
      id: e.target.id.toString(),
      category: "backups",
    };

    await props.moveApplicantMutation({
      variables: moveApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });
    await message.success(
      `${findApplicant && findApplicant.name} has now been moved to Backups!`
    );
  };

  const btnMoveToRecos = async (e) => {
    e.preventDefault();

    let findApplicant =
      applicantsData &&
      applicantsData.find((applicant) => applicant.id === e.target.id);

    let moveApplicant = {
      id: e.target.id.toString(),
      category: "recos",
    };

    await props.moveApplicantMutation({
      variables: moveApplicant,
      refetchQueries: [
        {
          query: getApplicantsQuery,
        },
      ],
    });
    await message.success(
      `${findApplicant && findApplicant.name} has now been moved to Recos!`
    );
  };

  return (
    <div
      style={{
        margin: "2rem auto",
        maxWidth: "50rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      {props.getApplicantsQuery.loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h2>Fetching data...</h2>
          <SyncOutlined spin style={{ fontSize: "5rem" }} />
        </div>
      ) : (
        <div>
          <Row style={{ marginBottom: 20 }}>
            <Col
              span={13}
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "flex-start",
              }}
            ></Col>
            <Col
              span={11}
              style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}
            >
              <Link to="/add">
                <Button
                  style={{
                    background: "#4BCC49",
                    border: "#59B858",
                    color: "white",
                  }}
                  type="primary"
                  shape="round"
                  size="large"
                  block
                >
                  <UserAddOutlined /> Add Applicant
                </Button>
              </Link>
            </Col>
          </Row>
          <Row style={{ marginBottom: 50 }}>
            <Tabs
              style={{ width: "100%" }}
              defaultActiveKey="All"
              onChange={(tabKey) => setTabKey(tabKey)}
              centered
            >
              <TabPane tab={<span>All ({allCount})</span>} key="All">
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) =>
                      applicant.status === "pending" ||
                      applicant.status === "rejected" ? (
                        <List.Item
                          style={{ textAlign: "center" }}
                          key={applicant.id}
                          actions={[
                            <Link to={`/applicant/${applicant.id}`}>
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={EditFilled}
                                text="Edit"
                                key="list-vertical-edit"
                              />
                            </Link>,
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={UserDeleteOutlined}
                              text="Delete"
                              key="list-vertical-delete"
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            style={{ textAlign: "left" }}
                            avatar={
                              <Avatar size={80} icon={<UserOutlined />} />
                            }
                            title={
                              <Link to={`/applicant/${applicant.id}`}>
                                {applicant.name}
                              </Link>
                            }
                            description={
                              <div>
                                <Row
                                  style={{
                                    display: "flex",
                                    flex: 1,
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Col>
                                    {applicant.username} <br />{" "}
                                    {applicant.email}
                                  </Col>
                                  {applicant.status === "rejected" ||
                                  applicant.status === "pending" ? (
                                    <Col
                                      style={{
                                        textAlign: "right",
                                      }}
                                    >
                                      <h5>
                                        Status:{" "}
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {applicant.status === "rejected" ? (
                                            <span style={{ color: "#d52735" }}>
                                              {applicant.status}
                                            </span>
                                          ) : (
                                            <span style={{ color: "#2798ee" }}>
                                              {applicant.status}
                                            </span>
                                          )}
                                        </span>
                                      </h5>
                                    </Col>
                                  ) : (
                                    <Col
                                      style={{
                                        textAlign: "right",
                                      }}
                                    >
                                      <h5>
                                        Status:{" "}
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          <span style={{ color: "#36c770" }}>
                                            {applicant.status}
                                          </span>
                                        </span>
                                      </h5>
                                      <h5>
                                        Category:{" "}
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {applicant.category}
                                        </span>
                                      </h5>
                                    </Col>
                                  )}
                                </Row>
                                {applicant.status === "pending" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flex: 1,
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Button
                                      shape="round"
                                      onClick={btnSaveApplicant}
                                      className="save"
                                    >
                                      <span id={applicant.id}>
                                        Save <CheckOutlined />
                                      </span>
                                    </Button>
                                    <Button
                                      shape="round"
                                      onClick={btnRejectApplicant}
                                      className="reject"
                                    >
                                      <span id={applicant.id}>
                                        Reject <CloseOutlined />
                                      </span>
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      ) : (
                        <List.Item
                          style={{ textAlign: "center" }}
                          key={applicant.id}
                          actions={[
                            <Link to={`/applicant/${applicant.id}`}>
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={EditFilled}
                                text="Edit"
                                key="list-vertical-edit"
                              />
                            </Link>,
                            <Dropdown
                              id={applicant.id}
                              key={applicant.id}
                              overlay={
                                <Menu>
                                  <Menu.Item>
                                    <Button onClick={btnMoveToSelections} block>
                                      <span id={applicant.id}>Selections</span>
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button onClick={btnMoveToBackups} block>
                                      <span id={applicant.id}>Backups</span>
                                    </Button>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <Button onClick={btnMoveToRecos} block>
                                      <span id={applicant.id}>Recos</span>
                                    </Button>
                                  </Menu.Item>
                                </Menu>
                              }
                              trigger={["click"]}
                              placement="topCenter"
                            >
                              <a href="#">
                                <IconText
                                  id={applicant.id}
                                  name={applicant.name}
                                  icon={ForwardOutlined}
                                  text="Move To"
                                  key="list-vertical-move"
                                />
                              </a>
                            </Dropdown>,
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={UserDeleteOutlined}
                              text="Delete"
                              key="list-vertical-delete"
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            style={{ textAlign: "left" }}
                            avatar={
                              <Avatar size={80} icon={<UserOutlined />} />
                            }
                            title={
                              <Link to={`/applicant/${applicant.id}`}>
                                {applicant.name}
                              </Link>
                            }
                            description={
                              <div>
                                <Row
                                  style={{
                                    display: "flex",
                                    flex: 1,
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Col>
                                    {applicant.username} <br />{" "}
                                    {applicant.email}
                                  </Col>
                                  {applicant.status === "rejected" ||
                                  applicant.status === "pending" ? (
                                    <Col
                                      style={{
                                        textAlign: "right",
                                      }}
                                    >
                                      <h5>
                                        Status:{" "}
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {applicant.status === "rejected" ? (
                                            <span style={{ color: "#d52735" }}>
                                              {applicant.status}
                                            </span>
                                          ) : (
                                            <span style={{ color: "#2798ee" }}>
                                              {applicant.status}
                                            </span>
                                          )}
                                        </span>
                                      </h5>
                                    </Col>
                                  ) : (
                                    <Col
                                      style={{
                                        textAlign: "right",
                                      }}
                                    >
                                      <h5>
                                        Status:{" "}
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          <span style={{ color: "#36c770" }}>
                                            {applicant.status}
                                          </span>
                                        </span>
                                      </h5>
                                      <h5>
                                        Category:{" "}
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {applicant.category}
                                        </span>
                                      </h5>
                                    </Col>
                                  )}
                                </Row>
                                {applicant.status === "pending" ? (
                                  <div>
                                    <Button
                                      shape="round"
                                      onClick={btnSaveApplicant}
                                      className="save"
                                    >
                                      <span id={applicant.id}>
                                        Save <CheckOutlined />
                                      </span>
                                    </Button>
                                    <Button
                                      shape="round"
                                      onClick={btnRejectApplicant}
                                      className="reject"
                                    >
                                      <span id={applicant.id}>
                                        Reject <CloseOutlined />
                                      </span>
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )
                    }
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
              <TabPane
                tab={<span>Pending ({pendingCount})</span>}
                key="Pending"
              >
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) => (
                      <List.Item
                        style={{ textAlign: "center" }}
                        key={applicant.id}
                        actions={[
                          <Link to={`/applicant/${applicant.id}`}>
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={EditFilled}
                              text="Edit"
                              key="list-vertical-edit"
                            />
                          </Link>,
                          <IconText
                            id={applicant.id}
                            name={applicant.name}
                            icon={UserDeleteOutlined}
                            text="Delete"
                            key="list-vertical-delete"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          style={{ textAlign: "left" }}
                          avatar={<Avatar size={80} icon={<UserOutlined />} />}
                          title={
                            <Link to={`/applicant/${applicant.id}`}>
                              {applicant.name}
                            </Link>
                          }
                          description={
                            <div>
                              {applicant.username} <br /> {applicant.email}
                              <div>
                                <Button
                                  shape="round"
                                  onClick={btnSaveApplicant}
                                  className="save"
                                >
                                  <span id={applicant.id}>
                                    Save <CheckOutlined />
                                  </span>
                                </Button>
                                <Button
                                  shape="round"
                                  onClick={btnRejectApplicant}
                                  className="reject"
                                >
                                  <span id={applicant.id}>
                                    Reject <CloseOutlined />
                                  </span>
                                </Button>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
              <TabPane tab={<span>Saved ({savedCount})</span>} key="Saved">
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) => (
                      <List.Item
                        style={{ textAlign: "center" }}
                        key={applicant.id}
                        actions={[
                          <Link to={`/applicant/${applicant.id}`}>
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={EditFilled}
                              text="Edit"
                              key="list-vertical-edit"
                            />
                          </Link>,
                          <Dropdown
                            id={applicant.id}
                            key={applicant.id}
                            overlay={
                              <Menu>
                                <Menu.Item>
                                  <Button onClick={btnRejectApplicant} block>
                                    <span id={applicant.id}>Rejected</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToSelections} block>
                                    <span id={applicant.id}>Selections</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToBackups} block>
                                    <span id={applicant.id}>Backups</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToRecos} block>
                                    <span id={applicant.id}>Recos</span>
                                  </Button>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                            placement="topCenter"
                          >
                            <a href="#">
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={ForwardOutlined}
                                text="Move To"
                                key="list-vertical-move"
                              />
                            </a>
                          </Dropdown>,
                          <IconText
                            id={applicant.id}
                            name={applicant.name}
                            icon={UserDeleteOutlined}
                            text="Delete"
                            key="list-vertical-delete"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          style={{ textAlign: "left" }}
                          avatar={<Avatar size={80} icon={<UserOutlined />} />}
                          title={
                            <Link to={`/applicant/${applicant.id}`}>
                              {applicant.name}
                            </Link>
                          }
                          description={
                            <div>
                              <Row
                                style={{
                                  display: "flex",
                                  flex: 1,
                                  justifyContent: "space-between",
                                }}
                              >
                                <Col>
                                  {applicant.username} <br /> {applicant.email}
                                </Col>
                                <Col
                                  style={{
                                    textAlign: "right",
                                  }}
                                >
                                  <h5>
                                    Category:{" "}
                                    <span
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {applicant.category}
                                    </span>
                                  </h5>
                                </Col>
                              </Row>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
              <TabPane
                tab={<span>Rejected ({rejectedCount})</span>}
                key="Rejected"
              >
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) => (
                      <List.Item
                        style={{ textAlign: "center" }}
                        key={applicant.id}
                        actions={[
                          <Link to={`/applicant/${applicant.id}`}>
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={EditFilled}
                              text="Edit"
                              key="list-vertical-edit"
                            />
                          </Link>,
                          <Dropdown
                            id={applicant.id}
                            key={applicant.id}
                            overlay={
                              <Menu>
                                <Menu.Item>
                                  <Button onClick={btnMoveToPending} block>
                                    <span id={applicant.id}>Pending</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnSaveApplicant} block>
                                    <span id={applicant.id}>Saved</span>
                                  </Button>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                            placement="topCenter"
                          >
                            <a href="#">
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={ForwardOutlined}
                                text="Move To"
                                key="list-vertical-move"
                              />
                            </a>
                          </Dropdown>,
                          <IconText
                            id={applicant.id}
                            name={applicant.name}
                            icon={UserDeleteOutlined}
                            text="Delete"
                            key="list-vertical-delete"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          style={{ textAlign: "left" }}
                          avatar={<Avatar size={80} icon={<UserOutlined />} />}
                          title={
                            <Link to={`/applicant/${applicant.id}`}>
                              {applicant.name}
                            </Link>
                          }
                          description={
                            <div>
                              {applicant.username} <br /> {applicant.email}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
              <TabPane
                tab={<span>Selections ({selectionsCount})</span>}
                key="Selections"
              >
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) => (
                      <List.Item
                        style={{ textAlign: "center" }}
                        key={applicant.id}
                        actions={[
                          <Link to={`/applicant/${applicant.id}`}>
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={EditFilled}
                              text="Edit"
                              key="list-vertical-edit"
                            />
                          </Link>,
                          <Dropdown
                            id={applicant.id}
                            key={applicant.id}
                            overlay={
                              <Menu>
                                <Menu.Item>
                                  <Button onClick={btnMoveToSelections} block>
                                    <span id={applicant.id}>Selections</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToBackups} block>
                                    <span id={applicant.id}>Backups</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToRecos} block>
                                    <span id={applicant.id}>Recos</span>
                                  </Button>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                            placement="topCenter"
                          >
                            <a href="#">
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={ForwardOutlined}
                                text="Move To"
                                key="list-vertical-move"
                              />
                            </a>
                          </Dropdown>,
                          <IconText
                            id={applicant.id}
                            name={applicant.name}
                            icon={UserDeleteOutlined}
                            text="Delete"
                            key="list-vertical-delete"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          style={{ textAlign: "left" }}
                          avatar={<Avatar size={80} icon={<UserOutlined />} />}
                          title={
                            <Link to={`/applicant/${applicant.id}`}>
                              {applicant.name}
                            </Link>
                          }
                          description={
                            <div>
                              {applicant.username} <br /> {applicant.email}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
              <TabPane
                tab={<span>Backups ({backupsCount})</span>}
                key="Backups"
              >
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) => (
                      <List.Item
                        style={{ textAlign: "center" }}
                        key={applicant.id}
                        actions={[
                          <Link to={`/applicant/${applicant.id}`}>
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={EditFilled}
                              text="Edit"
                              key="list-vertical-edit"
                            />
                          </Link>,
                          <Dropdown
                            id={applicant.id}
                            key={applicant.id}
                            overlay={
                              <Menu>
                                <Menu.Item>
                                  <Button onClick={btnMoveToSelections} block>
                                    <span id={applicant.id}>Selections</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToBackups} block>
                                    <span id={applicant.id}>Backups</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToRecos} block>
                                    <span id={applicant.id}>Recos</span>
                                  </Button>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                            placement="topCenter"
                          >
                            <a href="#">
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={ForwardOutlined}
                                text="Move To"
                                key="list-vertical-move"
                              />
                            </a>
                          </Dropdown>,
                          <IconText
                            id={applicant.id}
                            name={applicant.name}
                            icon={UserDeleteOutlined}
                            text="Delete"
                            key="list-vertical-delete"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          style={{ textAlign: "left" }}
                          avatar={<Avatar size={80} icon={<UserOutlined />} />}
                          title={
                            <Link to={`/applicant/${applicant.id}`}>
                              {applicant.name}
                            </Link>
                          }
                          description={
                            <div>
                              {applicant.username} <br /> {applicant.email}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
              <TabPane tab={<span>Recos ({recosCount})</span>} key="Recos">
                {applicantsData ? (
                  <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 3,
                    }}
                    dataSource={applicantsData}
                    renderItem={(applicant) => (
                      <List.Item
                        style={{ textAlign: "center" }}
                        key={applicant.id}
                        actions={[
                          <Link to={`/applicant/${applicant.id}`}>
                            <IconText
                              id={applicant.id}
                              name={applicant.name}
                              icon={EditFilled}
                              text="Edit"
                              key="list-vertical-edit"
                            />
                          </Link>,
                          <Dropdown
                            id={applicant.id}
                            key={applicant.id}
                            overlay={
                              <Menu>
                                <Menu.Item>
                                  <Button onClick={btnMoveToSelections} block>
                                    <span id={applicant.id}>Selections</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToBackups} block>
                                    <span id={applicant.id}>Backups</span>
                                  </Button>
                                </Menu.Item>
                                <Menu.Item>
                                  <Button onClick={btnMoveToRecos} block>
                                    <span id={applicant.id}>Recos</span>
                                  </Button>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                            placement="topCenter"
                          >
                            <a href="#">
                              <IconText
                                id={applicant.id}
                                name={applicant.name}
                                icon={ForwardOutlined}
                                text="Move To"
                                key="list-vertical-move"
                              />
                            </a>
                          </Dropdown>,
                          <IconText
                            id={applicant.id}
                            name={applicant.name}
                            icon={UserDeleteOutlined}
                            text="Delete"
                            key="list-vertical-delete"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          style={{ textAlign: "left" }}
                          avatar={<Avatar size={80} icon={<UserOutlined />} />}
                          title={
                            <Link to={`/applicant/${applicant.id}`}>
                              {applicant.name}
                            </Link>
                          }
                          description={
                            <div>
                              {applicant.username} <br /> {applicant.email}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty />
                )}
              </TabPane>
            </Tabs>
          </Row>
        </div>
      )}
      {/* <Modal
        title="Move Applicant"
        centered
        visible={moveConfirmModal}
        footer={null}
        onCancel={() => showMoveConfirmModal(false)}
        selectedRow={selectedRow}
      >
        {applicantsData &&
        applicantsData.find((applicant) => applicant.id === selectedRow) &&
        applicantsData.find((applicant) => applicant.id === selectedRow)
          .category === "selections" ? (
          <div>
            <Button value={selectedRow} onClick={btnMoveToBackups} block>
              Backups
            </Button>
            <Button value={selectedRow} onClick={btnMoveToRecos} block>
              Recos
            </Button>
          </div>
        ) : applicantsData &&
          applicantsData.find((applicant) => applicant.id === selectedRow) &&
          applicantsData.find((applicant) => applicant.id === selectedRow)
            .category === "backups" ? (
          <div>
            <Button value={selectedRow} onClick={btnMoveToSelections} block>
              Selections
            </Button>
            <Button value={selectedRow} onClick={btnMoveToRecos} block>
              Recos
            </Button>
          </div>
        ) : applicantsData &&
          applicantsData.find((applicant) => applicant.id === selectedRow) &&
          applicantsData.find((applicant) => applicant.id === selectedRow)
            .category === "recos" ? (
          <div>
            <Button value={selectedRow} onClick={btnMoveToSelections} block>
              Selections
            </Button>
            <Button value={selectedRow} onClick={btnMoveToBackups} block>
              Backups
            </Button>
          </div>
        ) : (
          ""
        )}
      </Modal> */}

      <Modal
        title="Delete Applicant"
        centered
        visible={deleteConfirmModal}
        onOk={btnDeleteApplicant}
        okButtonProps={{ danger: true, shape: "round" }}
        onCancel={() => showDeleteConfirmModal(false)}
        cancelButtonProps={{
          style: { border: "none" },
        }}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this applicant?</p>
      </Modal>
    </div>
  );
};

export default compose(
  graphql(getApplicantsQuery, { name: "getApplicantsQuery" }),
  graphql(saveOrRejectApplicantMutation, {
    name: "saveOrRejectApplicantMutation",
  }),
  graphql(moveApplicantMutation, { name: "moveApplicantMutation" }),
  graphql(deleteApplicantMutation, { name: "deleteApplicantMutation" })
)(Home);
