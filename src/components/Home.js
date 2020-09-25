import React, { useState } from "react";
// import { Table } from "antd";
import Geocode from "react-geocode";
import { Link } from "react-router-dom";
import {
  Avatar,
  Row,
  Col,
  Divider,
  Spin,
  Button,
  Modal,
  Drawer,
  Radio,
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
} from "@ant-design/icons";

import "./Home.css";

import applicants from "../applicants.json";

const { TabPane } = Tabs;

export const Home = (props) => {
  const [deleteConfirmModal, showDeleteConfirmModal] = useState(false);
  const [moveConfirmModal, showMoveConfirmModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // const applicants = null;

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

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
      {!applicants ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
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
            {/* <h3>Filter By:</h3>
            <div>
              <Col style={{ paddingLeft: 30 }}>
                <label className="radio">
                  ALL
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilter === "all"}
                    value="all"
                    onChange={(e) => setSelectedFilter("all")}
                  />
                  <span className="checkmark"></span>
                </label>
                <label className="radio">
                  PENDING
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilter === "pending"}
                    value="pending"
                    onChange={(e) => setSelectedFilter("pending")}
                  />
                  <span className="checkmark"></span>
                </label>
                <label className="radio">
                  SAVED
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilter === "saved"}
                    value="saved"
                    onChange={(e) => setSelectedFilter("saved")}
                  />
                  <span className="checkmark"></span>
                </label>
                <label className="radio">
                  REJECTED
                  <input
                    type="radio"
                    name="status"
                    checked={selectedFilter === "rejected"}
                    value="rejected"
                    onChange={(e) => setSelectedFilter("rejected")}
                  />
                  <span className="checkmark"></span>
                </label>
              </Col>
            </div> */}
            <Tabs style={{ width: "100%" }} defaultActiveKey="all" centered>
              <TabPane tab="All" key="All">
                <List
                  itemLayout="vertical"
                  size="small"
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 3,
                  }}
                  dataSource={applicants}
                  renderItem={(applicant) => (
                    <List.Item
                      style={{ textAlign: "center" }}
                      key={applicant.id}
                      actions={[
                        <Link to="/edit/1">
                          <IconText
                            icon={EditFilled}
                            text="Edit"
                            key="list-vertical-edit"
                          />
                        </Link>,
                        <IconText
                          icon={ForwardOutlined}
                          text="Move To"
                          key="list-vertical-move"
                        />,
                        <IconText
                          icon={UserDeleteOutlined}
                          text="Delete"
                          key="list-vertical-delete"
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        style={{ textAlign: "left" }}
                        avatar={<Avatar size={80} icon={<UserOutlined />} />}
                        title={<Link to="/view/1">{applicant.name}</Link>}
                        description={
                          <div>
                            {applicant.username} <br /> {applicant.email}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                {/* {applicants.map((applicant) => {
                  return (
                    <Row
                      key={applicant.id}
                      style={{
                        display: "flex",
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <Col span={20}>
                        <Col style={{ float: "left" }}></Col>
                        <Col>
                          <h2>{applicant.name}</h2>
                          <h4>@{applicant.username}</h4>
                          <span>{applicant.email}</span>
                        </Col>
                        <Divider dashed />
                      </Col>
                      <Col>
                        <Button type="primary" shape="circle" size="medium">
                          <EditFilled />
                        </Button>
                        <Button
                          type="primary"
                          danger={true}
                          shape="circle"
                          size="medium"
                          onClick={() => showDeleteConfirmModal(true)}
                        >
                          <UserDeleteOutlined />
                        </Button>
                        <br />
                        <Button
                          type="round"
                          size="medium"
                          onClick={() => showDeleteConfirmModal(true)}
                          block
                        >
                          <ForwardOutlined />
                        </Button>
                      </Col>
                    </Row>
                  );
                })} */}
              </TabPane>
              <TabPane tab="Pending" key="Pending">
                Content of Tab Pane Pending
              </TabPane>
              <TabPane tab="Saved" key="Saved">
                Content of Tab Pane Saved
              </TabPane>
              <TabPane tab="Rejected" key="Rejected">
                Content of Tab Pane Rejected
              </TabPane>
              <TabPane tab="Selections" key="Selections">
                Content of Tab Pane Selections
              </TabPane>
              <TabPane tab="Backups" key="Backups">
                Content of Tab Pane Backups
              </TabPane>
              <TabPane tab="Recos" key="Recos">
                Content of Tab Pane Recos
              </TabPane>
            </Tabs>
          </Row>
        </div>
      )}
      <Modal
        title="Move Applicant"
        centered
        visible={moveConfirmModal}
        onOk={() => showMoveConfirmModal(false)}
        okButtonProps={{ danger: true, shape: "round" }}
        onCancel={() => showMoveConfirmModal(false)}
        cancelButtonProps={{
          style: { border: "none" },
        }}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to Move this applicant?</p>
      </Modal>

      <Modal
        title="Delete Applicant"
        centered
        visible={deleteConfirmModal}
        onOk={() => showDeleteConfirmModal(false)}
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
