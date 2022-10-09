import React from "react";
import {
    Button,
    ButtonGroup,
    FormControl, FormHelperText, FormLabel, Input, InputGroup, InputLeftAddon, InputLeftElement, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Select,
    Tab,
    TabList, TabPanel, TabPanels,
    Tabs, Textarea, useDisclosure
} from "@chakra-ui/react";
import {RiShareCircleLine} from "react-icons/ri";
import {BiTransfer, BiCalendar} from "react-icons/bi";
import {TbDatabaseImport} from "react-icons/tb";
import CategorySelector from "./CategorySelector";

export default function AddTransaction({
                                           open,
                                           onClose,
                                           onChange
                                       }: { open: boolean, onClose: () => void, onChange: (e: any) => void }) {
    const disclosure = useDisclosure();

    React.useEffect(() => {
        if (open) {
            disclosure.onOpen();
        } else {
            disclosure.onClose();
        }
    }, [open]);

    const closeModal = () => {
        disclosure.onClose();
        if (onClose) {
            onClose();
        }
    }

    const onSelectCategory = (category) => {
        console.log(category);
    }

    const addTransaction = () => {
        if (onChange) {
            onChange(true);
        }
    };

    return (
        <Modal onClose={closeModal} isOpen={disclosure.isOpen} size="xl">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Add Transaction</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Tabs colorScheme={'orange'} variant="soft-rounded">
                        <TabList className="justify-content-center">
                            <Tab><RiShareCircleLine/>&nbsp;Expense</Tab>
                            <Tab><BiTransfer/>&nbsp;Transfer</Tab>
                            <Tab><TbDatabaseImport/>&nbsp;Income</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <CategorySelector type="expense" onChange={onSelectCategory}/>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>Amount</FormLabel>
                                            <InputGroup>
                                                <InputLeftAddon children='FCFA'/>
                                                <Input type='number' placeholder='Amount'/>
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                    <div className="col-sm-6">
                                        <FormControl className="mb-4">
                                            <FormLabel>Account</FormLabel>
                                            <Select placeholder='Select Account'>
                                                <option value='Mobile Money'>Mobile Money</option>
                                                <option value='UBA Bank'>UBA Bank</option>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <FormControl className="mb-4">
                                    <FormLabel>Date</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents='none'
                                            children={<BiCalendar/>}
                                        />
                                        <Input type='datetime' placeholder='Date'/>
                                    </InputGroup>
                                </FormControl>
                                <FormControl className="mb-4">
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <Textarea placeholder='Notes'/>
                                </FormControl>
                            </TabPanel>
                            <TabPanel>
                                <p>two!</p>
                            </TabPanel>
                            <TabPanel>
                                <CategorySelector type="income" onChange={onSelectCategory}/>
                                <FormControl>
                                    <FormLabel>Category</FormLabel>
                                    <Input type='email'/>
                                    <FormHelperText>Select Income Category</FormHelperText>
                                </FormControl>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup spacing={4}>
                        <Button onClick={onClose}>Close</Button>
                        <Button onClick={onClose} colorScheme="orange">Save</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}