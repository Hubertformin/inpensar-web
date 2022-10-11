import BottomNav from "../../../components/nav/BottomBar";
import {Alert, AlertIcon, AlertTitle} from "@chakra-ui/alert";
import {
    AlertDescription,
    Box,
    CloseButton,
} from "@chakra-ui/react";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";

export default function SettingsHome() {
    return (
        <ProjectViewLayout>
            <main className="page-view px-8 py-6">
                <div className="pg-header">
                    <h1 className="text-center mb-8 text-2xl font-bold">Inpensar</h1>
                    <Alert status="info">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>Hello Hubert,</AlertTitle>
                            <AlertDescription>
                                Easily record and track your expenses from this app. This app was designed to be
                                simple and direct.
                            </AlertDescription>
                        </Box>
                        <CloseButton
                            alignSelf="flex-start"
                            position="relative"
                            right={-1}
                            top={-1}
                            onClick={() => {}}
                        />
                    </Alert>
                </div>
            </main>
        </ProjectViewLayout>
    )
}