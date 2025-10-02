// @ts-ignore
import { SHOPIFY_STORE_DOMAIN, STOREFRONT_ACCESS_TOKEN } from "@env";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: SHOPIFY_STORE_DOMAIN,
    headers: {
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});
