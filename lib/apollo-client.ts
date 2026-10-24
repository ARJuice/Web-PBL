import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  if (typeof window === 'undefined') {
    return { headers };
  }
  const token = localStorage.getItem('match_sahrdaya_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ error }) => {
  if (error) {
    console.warn('[Apollo error]:', error.message || error);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['id'],
      },
      Match: {
        keyFields: ['id'],
      },
      Conversation: {
        keyFields: ['id'],
      },
      Message: {
        keyFields: ['id'],
      },
    },
  }),
});
