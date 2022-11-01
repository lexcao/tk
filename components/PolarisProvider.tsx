import {LinkLikeComponentProps} from "@shopify/polaris/build/ts/latest/src/utilities/link";
import Link from "next/link";
import React, {memo} from "react";
import {AppProvider} from "@shopify/polaris";

function NextLink({url, children, external, ...rest}: LinkLikeComponentProps) {
  if (external) {
    rest.target = "_blank";
    rest.rel = "noopener noreferrer";
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link prefetch href={url}>
      {children}
    </Link>
  )
}

const PolarisProvider = ({children}: {
  children: React.ReactNode;
}) => {
  return (
    <AppProvider i18n={{}} linkComponent={NextLink}>
      {children}
    </AppProvider>
  )
}

export default memo(PolarisProvider)
