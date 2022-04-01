import React from "react";
import ReactJson from "react-json-view";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

export const ModalJSON = ({
  isOpen,
  onClose,
  json,
}: {
  isOpen: boolean;
  onClose: () => void;
  json: any;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="100vw">
        <ModalHeader>Deploy JSON</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ReactJson theme="ocean" src={json} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
