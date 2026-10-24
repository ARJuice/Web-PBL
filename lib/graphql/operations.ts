import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        profileCompleted
        createdAt
        profile {
          displayName
          year
          bio
          gender
          showDob
          dateOfBirth
          intent
          matchMode
          avatarUrl
          interests {
            id
            name
            emoji
            category
          }
        }
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      profileCompleted
      createdAt
      profile {
        displayName
        year
        bio
        gender
        showDob
        dateOfBirth
        intent
        matchMode
        avatarUrl
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const ALL_INTERESTS_QUERY = gql`
  query AllInterests {
    allInterests {
      id
      name
      emoji
      category
    }
  }
`;

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      profileCompleted
      createdAt
      profile {
        displayName
        year
        bio
        gender
        showDob
        dateOfBirth
        intent
        matchMode
        avatarUrl
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      profileCompleted
      createdAt
      profile {
        displayName
        year
        bio
        gender
        showDob
        dateOfBirth
        intent
        matchMode
        avatarUrl
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const UPDATE_INTERESTS_MUTATION = gql`
  mutation UpdateInterests($interestIds: [String!]!) {
    updateInterests(interestIds: $interestIds) {
      id
      profile {
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const SET_MATCH_MODE_MUTATION = gql`
  mutation SetMatchMode($mode: MatchMode!) {
    setMatchMode(mode: $mode) {
      id
      profile {
        matchMode
      }
    }
  }
`;

export const EXECUTE_MATCH_MUTATION = gql`
  mutation ExecuteMatch($overrideMode: MatchMode) {
    executeMatch(overrideMode: $overrideMode) {
      id
      userAId
      userBId
      candidateEmail
      score
      sharedInterests
      mode
      status
      conversationId
      createdAt
      candidateProfile {
        displayName
        year
        bio
        gender
        showDob
        dateOfBirth
        intent
        matchMode
        avatarUrl
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const MY_MATCHES_QUERY = gql`
  query MyMatches {
    myMatches {
      id
      userAId
      userBId
      candidateEmail
      score
      sharedInterests
      mode
      status
      conversationId
      createdAt
      candidateProfile {
        displayName
        year
        bio
        gender
        showDob
        dateOfBirth
        intent
        matchMode
        avatarUrl
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const MATCH_QUERY = gql`
  query Match($id: ID!) {
    match(id: $id) {
      id
      userAId
      userBId
      candidateEmail
      score
      sharedInterests
      mode
      status
      conversationId
      createdAt
      candidateProfile {
        displayName
        year
        bio
        gender
        showDob
        dateOfBirth
        intent
        matchMode
        avatarUrl
        interests {
          id
          name
          emoji
          category
        }
      }
    }
  }
`;

export const MY_CONVERSATIONS_QUERY = gql`
  query MyConversations {
    myConversations {
      id
      matchId
      unreadCount
      lastMessageAt
      createdAt
      otherUser {
        id
        displayName
        avatarUrl
        year
        bio
        sharedInterests
      }
      lastMessage {
        id
        conversationId
        senderId
        content
        isRead
        createdAt
      }
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query Messages($conversationId: ID!, $limit: Int, $offset: Int) {
    messages(conversationId: $conversationId, limit: $limit, offset: $offset) {
      id
      conversationId
      senderId
      content
      isRead
      createdAt
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      conversationId
      senderId
      content
      isRead
      createdAt
    }
  }
`;

export const MARK_CONVERSATION_AS_READ_MUTATION = gql`
  mutation MarkConversationAsRead($conversationId: ID!) {
    markConversationAsRead(conversationId: $conversationId)
  }
`;

export const BLOCK_USER_MUTATION = gql`
  mutation BlockUser($targetUserId: ID!, $reason: String) {
    blockUser(targetUserId: $targetUserId, reason: $reason)
  }
`;

export const REPORT_USER_MUTATION = gql`
  mutation ReportUser($input: ReportUserInput!) {
    reportUser(input: $input)
  }
`;
