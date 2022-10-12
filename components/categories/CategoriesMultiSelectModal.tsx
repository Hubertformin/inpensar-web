import React from "react";
import {
  InputGroup,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  InputLeftElement,
  ButtonGroup,
  Button,
  ModalFooter,
  Avatar,
} from "@chakra-ui/react";
import { IoIosSearch } from "react-icons/io";
import { Data } from "../../data";
import { IoWalletOutline } from "react-icons/io5";
import { formatCurrency } from "../../utils/number";
import { getRandomItemFromList } from "../../utils/array";

interface CreateBudgetProps {
  open: boolean;
  onClose: () => void;
}
export default function CategoriesMultiSelectModal({
  open,
  onClose,
}: CreateBudgetProps) {
  const disclosure = useDisclosure();
  const [displayCategories, setDisplayCategories] = React.useState(
    Data.expense_categories
  );

  const openModal = React.useCallback(() => {
    disclosure.onOpen();
  }, [disclosure]);

  React.useEffect(() => {
    if (open) {
      // open modal
      openModal();
    } else {
      disclosure.onClose();
    }
  }, [disclosure, open, openModal]);

  const closeModal = () => {
    setDisplayCategories(Data.expense_categories);
    disclosure.onClose();
    if (onClose) {
      onClose();
    }
  };

  const onSearch = (e) => {
    const val = e.target.value;
    if (!val) {
      setDisplayCategories(Data.expense_categories);
      return;
    }

    const regex = new RegExp(val, "i");
    const results = Data.expense_categories.filter((category) =>
      category?.name.match(regex)
    );
    if (results.length > 0) {
      setDisplayCategories(results);
    } else {
      const other = Data.expense_categories.find(
        (category) => category.name.toLowerCase() === "other"
      );
      if (other) {
        setDisplayCategories([other]);
      } else {
        setDisplayCategories([]);
      }
    }
  };

  const onConfirm = () => {};

  return (
    <Modal
      onClose={closeModal}
      isOpen={disclosure.isOpen}
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
      blockScrollOnMount={false}
      scrollBehavior={"inside"}
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Categories</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <IoIosSearch size={24} />
            </InputLeftElement>
            <Input type="search" onChange={onSearch} placeholder="Search" />
          </InputGroup>

          <div className="mt-8" style={{ height: "350px", overflowY: "auto" }}>
            <div className="categories grid gap-4 grid-cols-4">
              {displayCategories.map((category, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col cursor-pointer items-center justify-center mb-4"
                  >
                    <div className="mb-2">
                      <Avatar
                        src={category.icon}
                        name={category.name}
                        bg={getRandomItemFromList([
                          "blue.500",
                          "purple.500",
                          "orange.500",
                          "green.400",
                        ])}
                        size="lg"
                        color="white"
                      />
                    </div>
                    <div className="font-medium w-full text-center truncate text-xs">
                      {category.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={4}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              loadingText={"Saving"}
              onClick={onConfirm}
              colorScheme="purple"
            >
              Confirm
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
