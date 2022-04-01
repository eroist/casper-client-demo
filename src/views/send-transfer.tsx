import React, { useState } from "react";
import { Signer } from "casper-js-sdk";
import {
  Box,
  Flex,
  Text,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightAddon,
  VStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { ModalJSON } from "../components/modal-json";
import { buildTransferDeploy, sendTransferDeploy } from "../service/casper";

export const SendTransferView = ({
  activePublicKey,
  networkName,
}: {
  activePublicKey: string;
  networkName: string;
}) => {
  const [toAddress, setToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferId, setTransferId] = useState("");
  const [signedDeploy, setSignedDeploy] = useState({});
  const [deployHash, setDeployHash] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const signDeploy = async () => {
    const deployJSON = buildTransferDeploy({
      networkName,
      fromAddrHex: activePublicKey,
      toAddrHex: toAddress,
      amount: transferAmount,
      id: transferId,
      ttl: 18000,
    });
    const signedDeploy = await Signer.sign(
      deployJSON,
      activePublicKey,
      toAddress
    );
    setSignedDeploy(signedDeploy);
  };

  const sendDeploy = async () => {
    const hash = await sendTransferDeploy(signedDeploy).catch(alert);
    if (hash) setDeployHash(hash);
  };

  const sendTransferUI = () => (
    <>
      <Text>Send Transfer</Text>

      <FormControl id="network-name" isRequired>
        <FormLabel>Network Name</FormLabel>
        <Input value={networkName} disabled />
      </FormControl>

      <FormControl id="sender-address" isRequired>
        <FormLabel>Sender Address</FormLabel>
        <Input value={activePublicKey} disabled />
      </FormControl>

      <FormControl id="receiver-address" isRequired>
        <FormLabel>Receiver Address</FormLabel>
        <Input
          value={toAddress}
          onChange={(ev) => setToAddress(ev.target.value)}
          placeholder="Receiver Address"
          disabled={!!signedDeploy}
        />
      </FormControl>

      <FormControl id="transfer-amount" isRequired>
        <FormLabel>Transfer Amount</FormLabel>
        <InputGroup>
          <Input
            value={transferAmount}
            onChange={(ev) => setTransferAmount(ev.target.value)}
            placeholder="min. 2500000000"
            disabled={!!signedDeploy}
          />
          <InputRightAddon children="motes" />
        </InputGroup>
      </FormControl>

      <FormControl id="transfer-id" isRequired>
        <FormLabel>Transfer Id</FormLabel>
        <Input
          value={transferId}
          onChange={(ev) => setTransferId(ev.target.value)}
          placeholder="Transfer Id"
          disabled={!!signedDeploy}
        />
      </FormControl>
      {!signedDeploy ? (
        <Box>
          <Button onClick={signDeploy}>Sign Transfer</Button>
        </Box>
      ) : (
        <Flex align="space-between">
          <Button mr="3" onClick={onOpen}>
            Show Transfer
          </Button>
          <Button onClick={sendDeploy}>Send Transfer</Button>
        </Flex>
      )}
    </>
  );

  const transferSucceeded = () => (
    <>
      <Text>Transfer sent successfully. Deploy hash: {deployHash}.</Text>
    </>
  );

  return (
    <Box>
      <ModalJSON json={signedDeploy} isOpen={isOpen} onClose={onClose} />
      <VStack width={500} spacing={8} mx="auto">
        {deployHash ? transferSucceeded() : sendTransferUI()}
      </VStack>
    </Box>
  );
};
