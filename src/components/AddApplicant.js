import React from "react";
import { Link } from "react-router-dom";

import {
  Row,
  Col,
  Button,
  Form,
  Layout,
  Select,
  Input,
  Icon,
  Divider,
} from "antd";

const { Content } = Layout;

export const AddApplicant = () => {
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const validateMessages = {
    required: "'${label}' is required!",
    types: {
      email: "'${label}' is not a valid email!",
      number: "'${label}' is not a valid number!",
    },
    number: {
      range: "'${label}' must be between '${min}' and '${max}'",
    },
  };

  const onFinish = (values) => {
    values.status = "pending";
    values.category = null;
    console.log(values);
  };

  return (
    <div style={{ margin: "auto", maxWidth: "50rem" }}>
      <h1>New Applicant Information</h1>

      <Layout>
        <Content style={{ padding: "20px" }}>
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Link to="/">
                <Button type="text" htmlType="back" style={{ margin: 5 }}>
                  Go Back
                </Button>
              </Link>
              <Button type="primary" htmlType="submit" style={{ margin: 5 }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </div>
  );
};
