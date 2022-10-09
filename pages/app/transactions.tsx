import BottomNav from "../components/BottomBar";
import {
    Button,
    ButtonGroup,
    Divider, Select,
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
import { BsGrid } from "react-icons/bs";
import {useState} from "react";
import AddTransaction from "../components/AddTransaction";

export default function TransactionsHome() {
    const [showAddModal, setShowAddModal] = useState(false);

    const onAddTransaction = (e) => {
        console.log(e);
    };

    return (
        <div className="page-container">
            <main className="page-view px-8 py-6">
                <div className="toolbar mb-10 flex justify-between align-items-center">
                    <h1 className="text-center text-2xl font-bold text-orange-500">Inpensar</h1>
                    <div className="date">
                        <h4 className="text-sm font-bold mb-3"></h4>
                        <div className="actions flex">
                            <div className="mr-3" style={{width: '100px'}}>
                                <Select placeholder='Select Year'>
                                    <option value='20221'>2021</option>
                                    <option value='2022'>2022</option>
                                </Select>
                            </div>
                            <div className="mr-3" style={{width: '140px'}}>
                                <Select placeholder='Select Month'>
                                    <option value="0">January</option>
                                    <option value="1">February</option>
                                    <option value="2">March</option>
                                    <option value="3">April</option>
                                    <option value="4">May</option>
                                    <option value="5">June</option>
                                    <option value="6">July</option>
                                    <option value="7">August</option>
                                    <option value="8">September</option>
                                    <option value="9">October</option>
                                    <option value="10">November</option>
                                    <option value="11">December</option>
                                </Select>
                            </div>
                            <div className="mr-3" style={{width: '100px'}}>
                                <Select placeholder='Select Date'>
                                    <option value="0">All</option>
                                    <option value="1">1st</option>
                                    <option value="2">2nd</option>
                                    <option value="3">3rd</option>
                                    <option value="4">4th</option>
                                    <option value="5">5th</option>
                                    <option value="6">6th</option>
                                    <option value="7">7th</option>
                                    <option value="8">8th</option>
                                    <option value="9">9th</option>
                                    <option value="10">10th</option>
                                    <option value="11">11th</option>
                                    <option value="12">12th</option>
                                    <option value="13">13th</option>
                                    <option value="14">14th</option>
                                    <option value="15">15th</option>
                                    <option value="16">16th</option>
                                    <option value="17">17th</option>
                                    <option value="18">18th</option>
                                    <option value="19">19th</option>
                                    <option value="20">20th</option>
                                    <option value="21">21st</option>
                                    <option value="22">22nd</option>
                                    <option value="23">23rd</option>
                                    <option value="24">24th</option>
                                    <option value="25">25th</option>
                                    <option value="26">26th</option>
                                    <option value="27">27th</option>
                                    <option value="28">28th</option>
                                    <option value="29">29th</option>
                                    <option value="30">30th</option>
                                    <option value="31">31st</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pg-header mb-8">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl">Transactions</h1>
                        <ButtonGroup spacing='4'>
                            <Button colorScheme="orange" onClick={() => setShowAddModal(true)}>Add Transaction</Button>
                            {/*<Button>Add Expense</Button>*/}
                        </ButtonGroup>
                    </div>

                </div>
                <Divider/>
                <div className="mt-4">
                    <StatGroup>
                        <Stat>
                            <StatLabel>Income</StatLabel>
                            <StatNumber className={"text-blue-400"}>FCFA 345,670</StatNumber>
                            <StatHelpText>
                                {/*<StatArrow type='increase' />*/}
                                {/*23.36%*/}
                            </StatHelpText>
                        </Stat>

                        <Stat>
                            <StatLabel>Expenses</StatLabel>
                            <StatNumber className={"text-pink-400"}>FCFA 450,000</StatNumber>
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

                    <div className="transaction-body mt-6">
                        <Tabs colorScheme={'orange'} onChange={(t) => console.log(t)}>
                            <TabList>
                                <Tab><BsGrid />&nbsp;All</Tab>
                                <Tab><TbDatabaseImport/>&nbsp;Income</Tab>
                                <Tab><BiTransfer/>&nbsp;Transfer</Tab>
                                <Tab><RiShareCircleLine/>&nbsp;Expenses</Tab>
                            </TabList>
                        </Tabs>
                    </div>
                </div>
            </main>
            <BottomNav/>
            {/*    Modals*/}
            <AddTransaction open={showAddModal} onChange={onAddTransaction} onClose={() => setShowAddModal(false)} />
        </div>
    )
}