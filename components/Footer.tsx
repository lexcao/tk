import React, {memo} from "react"
import {Link, Stack, Text} from "@shopify/polaris";

const Footer = () => (
  <Stack vertical alignment="center">
    <Text color="subdued" as="p" variant="bodyMd">
      Powered by {' '}
      <Link
        url="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        external>
        Vercel
      </Link>
      {' '} & {' '}
      <Link url="https://polaris.shopify.com/" external>
        Shopify Polaris
      </Link>
    </Text>
    <Text color="subdued" as="p" variant="bodyMd">
      Created by {' '}
      <Link external url="https://lexcao.io">
        Lex
      </Link>
    </Text>
  </Stack>
)

export default memo(Footer)
