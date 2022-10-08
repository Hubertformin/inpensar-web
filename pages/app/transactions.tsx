import BottomNav from "../components/BottomBar";
import {
    Button,
    ButtonGroup,
    Divider, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay,
    Stat,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber, Tab, TabList, Tabs,
    useDisclosure,
} from "@chakra-ui/react";
import {BiTransfer} from "react-icons/bi";
import {RiShareCircleLine} from "react-icons/ri";
import {TbDatabaseImport} from "react-icons/tb";

export default function TransactionsHome() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="page-container">
            <main className="page-view px-8 py-6">
                <div className="toolbar">
                    <h1 className="text-center mb-8 text-2xl font-bold">Inpensar</h1>
                </div>
                <div className="pg-header mb-4">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl">Transactions</h1>
                        <ButtonGroup spacing='4'>
                            <Button colorScheme="orange" onClick={onOpen}>Add Transaction</Button>
                            <Button>Add Expense</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <Divider />
                <div className="mt-4">
                    <StatGroup>
                        <Stat>
                            <StatLabel>Income</StatLabel>
                            <StatNumber>FCFA 345,670</StatNumber>
                            <StatHelpText>
                                {/*<StatArrow type='increase' />*/}
                                {/*23.36%*/}
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Expenses</StatLabel>
                            <StatNumber>FCFA 450,000</StatNumber>
                            <StatHelpText>
                                {/*<StatArrow type='decrease' />*/}
                                {/*9.05%*/}
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Net Worth</StatLabel>
                            <StatNumber className={"text-red-500"}>- FCFA 105,670</StatNumber>
                            <StatHelpText>
                                {/*<StatArrow type='increase' />*/}
                                {/*23.36%*/}
                            </StatHelpText>
                        </Stat>
                    </StatGroup>
                </div>
            </main>
            <BottomNav />
        {/*    Modals*/}
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Transaction</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs colorScheme={'orange'} onChange={(t) => console.log(t)}>
                            <TabList>
                                <Tab><RiShareCircleLine />&nbsp;Expense</Tab>
                                <Tab><BiTransfer />&nbsp;Transaction</Tab>
                                <Tab><TbDatabaseImport />&nbsp;Income</Tab>
                            </TabList>
                        </Tabs>

                        <section className="form pt-8">
                            <Input variant='outline' placeholder='Description' />
                        </section>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing={4}>
                            <Button onClick={onClose}>Close</Button>
                            <Button onClick={onClose} colorScheme="orange">Save</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}