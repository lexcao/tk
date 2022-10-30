import React, {memo} from "react"
import {Link, Stack, TextStyle} from "@shopify/polaris";

const Footer = () => (
  <Stack vertical alignment="center">
    <TextStyle variation="subdued">
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
    </TextStyle>
    <TextStyle variation="subdued">
      Created by {' '}
      <Link external url="https://lexcao.io">
        Lex
      </Link>
    </TextStyle>
  </Stack>
)

export default memo(Footer)
