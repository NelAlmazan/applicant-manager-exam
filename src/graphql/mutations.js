import { gql } from "apollo-boost";

const createApplicantMutation = gql`
  mutation(
    $name: String
    $username: String
    $phone: String
    $email: String
    $address: String
    $lat: String
    $lng: String
    $status: String
    $category: String
  ) {
    createApplicant(
      name: $name
      username: $username
      phone: $phone
      email: $email
      address: $address
      lat: $lat
      lng: $lng
      status: $status
      category: $category
    ) {
      id
      name
      username
      email
      address
      lat
      lng
      phone
      status
      category
    }
  }
`;

const updateApplicantMutation = gql`
  mutation(
    $id: ID
    $name: String
    $username: String
    $phone: String
    $email: String
    $address: String
    $lat: String
    $lng: String
    $status: String
    $category: String
  ) {
    updateApplicant(
      id: $id
      name: $name
      username: $username
      status: $status
      category: $category
      phone: $phone
      email: $email
      address: $address
      lat: $lat
      lng: $lng
    ) {
      id
      name
      username
      phone
      email
      address
      lat
      lng
      status
      category
    }
  }
`;

const deleteApplicantMutation = gql`
  mutation($id: ID) {
    deleteApplicant(id: $id)
  }
`;

const saveOrRejectApplicantMutation = gql`
  mutation($id: ID, $status: String) {
    saveOrRejectApplicant(id: $id, status: $status) {
      id
      status
    }
  }
`;

const moveApplicantMutation = gql`
  mutation($id: ID, $category: String) {
    moveApplicant(id: $id, category: $category) {
      id
      category
    }
  }
`;

export {
  createApplicantMutation,
  updateApplicantMutation,
  deleteApplicantMutation,
  saveOrRejectApplicantMutation,
  moveApplicantMutation,
};
