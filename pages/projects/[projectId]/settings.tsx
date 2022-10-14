import BottomNav from "../../../components/nav/BottomBar";
import {Alert, AlertIcon, AlertTitle} from "@chakra-ui/alert";
import {
    AlertDescription,
    Box, Button,
    CloseButton, FormControl, Select,
} from "@chakra-ui/react";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import React from "react";

export default function SettingsHome() {
    return (
        <ProjectViewLayout>
            <main className="page-view px-8 py-6">
                <div className="toolbar mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-2xl">Settings</h1>
                </div>
                <div className="pt-8">
                    <div className="settings-item mb-6">
                        <h4 className="font-bold mb-1">Language</h4>
                        {/*<p className="text-slate-500 mb-3">*/}
                        {/*    Select your base currency. Changing currency, the registered records will not be converted*/}
                        {/*</p>*/}
                        <div className="w-72">
                            <FormControl>
                                <Select>
                                    <option value="en">English</option>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                   <div className="settings-item mb-6">
                       <h4 className="font-bold mb-1">Currency</h4>
                       <p className="text-slate-500 mb-3">
                           Select your base currency. Changing currency, the registered records will not be converted
                       </p>
                       <div className="w-72">
                           <FormControl>
                               <Select>
                                   <option value="XAF">FCFA</option>
                                   <option value="NGN">Naira (NGN)</option>
                               </Select>
                           </FormControl>
                       </div>
                   </div>

                    <div className="settings-item mb-6">
                       <h4 className="font-bold mb-1">Reports Frequency</h4>
                       <p className="text-slate-500 mb-3">
                           When do you want Inpensar to send you reports email reports
                       </p>
                       <div className="w-72">
                           <FormControl>
                               <Select>
                                   <option value="weekly">Weekly</option>
                                   <option value="monthly">Monthly</option>
                               </Select>
                           </FormControl>
                       </div>
                        <div className="mt-6">
                            <Button colorScheme="purple">Save</Button>
                        </div>
                   </div>

                </div>
            </main>
        </ProjectViewLayout>
    )
}