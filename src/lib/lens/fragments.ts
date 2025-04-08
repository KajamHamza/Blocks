import { graphql } from "@lens-protocol/client";

export const AccountFragment = graphql(`
  fragment Account on Account {
    __typename
    username {
      localName
      namespace
    }
    address
    metadata {
      name
      bio
      picture
    }
  }
`);

export const fragments = [AccountFragment]; 