import {Avatar, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {RiShareCircleLine} from "react-icons/ri";
import {TbDatabaseImport} from "react-icons/tb";
import {BiTransfer} from "react-icons/bi";
import React from "react";
import dynamic from "next/dynamic";
import {Data} from "../../data";
import useUtils from "../../hooks/useUtils";
import {AnalyticsModel} from "../../models/analytics.model";
import {useSelector} from "react-redux";
import {selectAnalyticsState} from "../../store/slices/analytics.slice";

const CategoriesDoughnut = dynamic(
    () => import("./CategoriesDoughnut"),
    { ssr: false }
);

export default function CategoriesReportsTable() {
    const utils = useUtils();
    const analyticsState: AnalyticsModel = useSelector(selectAnalyticsState);

    return (
        <div className="rounded-lg shadow px-6 py-4">
            <div className="header pb-6">
                <h1 className="font-bold text-lg">Categories</h1>
                <p className="mb-0 text-slate-500">Top 5 categories</p>
            </div>
            {analyticsState && <Tabs colorScheme={"purple"} variant="soft-rounded">
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
                        {analyticsState?.categories.expenses.length === 0 ?
                            <div className={"flex h-64 justify-center flex-col items-center"}>
                                <h1 className="font-bold">No Categories to show</h1>
                                <p className="text-slate-500">Categories analytics will show here</p>
                            </div> :
                            <div className={'md:grid'} style={{gridTemplateColumns: 'auto 380px'}}>
                                <div className="pt-4 pr-6">
                                    {
                                        analyticsState?.categories.expenses.map((category, index) => {
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
                                    {analyticsState?.categories.expenses && <CategoriesDoughnut type={'expense'} categoriesData={analyticsState.categories.expenses} />}
                                </div>
                            </div>}
                    </TabPanel>
                    <TabPanel>
                        {analyticsState?.categories.income.length === 0 ?
                            <div className={"flex h-64 justify-center flex-col items-center"}>
                                <h1 className="font-bold">No Categories to show</h1>
                                <p className="text-slate-500">Categories analytics will show here</p>
                            </div> :
                            <div className={'md:grid'} style={{gridTemplateColumns: 'auto 380px'}}>
                                <div className="pt-4 pr-6">
                                    {
                                        analyticsState?.categories.income.map((category, index) => {
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
                                    {analyticsState?.categories.income && <CategoriesDoughnut type={'income'} categoriesData={analyticsState.categories.income} />}
                                </div>
                            </div>}
                    </TabPanel>
                    {/*<TabPanel>*/}
                    {/*    <p>three!</p>*/}
                    {/*</TabPanel>*/}
                </TabPanels>
            </Tabs>}
        </div>
    )
}