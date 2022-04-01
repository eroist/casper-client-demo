import React, { useEffect, useState } from "react";
import { ChakraProvider, Box, Grid, extendTheme } from "@chakra-ui/react";

import { STATUS_API } from "./constants";
import { ColorModeSwitcher } from "./components/color-mode-switcher";
import { SendTransferView } from "./views/send-transfer";
import { getActivePublicKey } from "./service/casper";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const CasperApp = () => {
  const [activePublicKey, setActivePublicKey] = useState("");
  const [networkName, setNetworkName] = useState("");

  useEffect(() => {
    const pkSet = async () => {
      const pk = await getActivePublicKey().catch(() =>
        alert(
          "Please install Signer and make sure the site is connected and there is an active key"
        )
      );
      if (pk) setActivePublicKey(pk);
    };

    const networkNameSet = async () => {
      const statusResponse = await fetch(STATUS_API);
      const json = await statusResponse.json();
      setNetworkName(json.chainspec_name);
    };

    pkSet();
    networkNameSet();
  }, []);

  return (
    <ChakraProvider theme={extendTheme({ config })}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <SendTransferView
            activePublicKey={activePublicKey}
            networkName={networkName}
          />
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
