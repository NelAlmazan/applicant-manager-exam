import { gql } from "apollo-boost";

const getApplicantsQuery = gql`
  {
    getApplicants {
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

const getApplicantQuery = gql`
  query($id: ID!) {
    getApplicantById(id: $id) {
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

export { getApplicantsQuery, getApplicantQuery };
