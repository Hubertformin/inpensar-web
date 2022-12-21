import {Avatar, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {RiShareCircleLine} from "react-icons/ri";
import {TbDatabaseImport} from "react-icons/tb";
import {BiTransfer} from "react-icons/bi";
import React from "react";
import dynamic from "next/dynamic";
import {Data} from "../../data";
import useUtils from "../../hooks/useUtils";

const CategoriesDoughnut = dynamic(
    () => import("./CategoriesDoughnut"),
    { ssr: false }
);
const expenseCategoriesData = Data.expense_categories.slice(0, 5).map(c => ({...c, amount: 10000 + Math.round(Math.random() * 100000)}));
const incomeCategoriesData = Data.income_categories.slice(0, 5).map(c => ({...c, amount: 10000 + Math.round(Math.random() * 100000)}));

export default function CategoriesReportsTable() {
    const utils = useUtils();

    return (
        <div className="rounded-lg shadow px-6 py-4">
            <div className="header pb-6">
                <h1 className="font-bold text-lg">Categories</h1>
                <p className="mb-0 text-slate-500">Top 5 categories</p>
            </div>
            <Tabs colorScheme={"purple"} variant="soft-rounded" onChange={console.log}>
                <TabList>
                    <Tab name="expenses">
                        <RiShareCircleLine/>
                        &nbsp;Expenses
                    </Tab>
                    <Tab name="income">
                        <TbDatabaseImport/>
                        &nbsp;Income
                    </Tab>
                    {/*<Tab name="transfer">*/}
                    {/*    <BiTransfer/>*/}
                    {/*    &nbsp;Transfers*/}
                    {/*</Tab>*/}
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <div className={'md:grid'} style={{gridTemplateColumns: 'auto 380px'}}>
                            <div className="pt-4 pr-6">
                                {
                                    expenseCategoriesData.map((category, index) => {
                                        return (
                                            <div key={index} className="flex border-b mb-3 pb-2 justify-between">
                                                <div className="flex items-center">
                                                    <Avatar src={category.icon} size="sm" name={category.name} />
                                                    <div className="pl-3">
                                                        <h4 className="font-medium">{category.name}</h4>
                                                    </div>
                                                </div>
                                                <div className="tail">
                                                    <h4 className="font-bold">{utils.formatCurrency(category.amount)}</h4>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="">
                                <CategoriesDoughnut type={'expense'} categoriesData={expenseCategoriesData} />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={'md:grid'} style={{gridTemplateColumns: 'auto 380px'}}>
                            <div className="pt-4 pr-6">
                                {
                                    incomeCategoriesData.map((category, index) => {
                                        return (
                                            <div key={index} className="flex border-b mb-3 pb-2 justify-between">
                                                <div className="flex items-center">
                                                    <Avatar src={category.icon} size="sm" name={category.name} />
                                                    <div className="pl-3">
                                                        <h4 className="font-medium">{category.name}</h4>
                                                    </div>
                                                </div>
                                                <div className="tail">
                                                    <h4 className="font-bold">{utils.formatCurrency(category.amount)}</h4>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="">
                                <CategoriesDoughnut type={'income'} categoriesData={incomeCategoriesData} />
                            </div>
                        </div>
                    </TabPanel>
                    {/*<TabPanel>*/}
                    {/*    <p>three!</p>*/}
                    {/*</TabPanel>*/}
                </TabPanels>
            </Tabs>
        </div>
    )
}