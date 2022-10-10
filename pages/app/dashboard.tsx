import BottomNav from "../components/BottomBar";
import {Alert, AlertIcon, AlertTitle} from "@chakra-ui/alert";
import {
    AlertDescription,
    Box,
    CloseButton,
    Stat, StatArrow,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber
} from "@chakra-ui/react";
import PageLayout from "../components/PageLayout";

export default function Dashboard() {
    return (
        <PageLayout>
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
                            alignSelf='flex-start'
                            position='relative'
                            right={-1}
                            top={-1}
                            onClick={() => {}}
                        />
                    </Alert>
                    <div className="mt-6">
                        <StatGroup>
                            <Stat>
                                <StatLabel>Income</StatLabel>
                                <StatNumber>FCFA 345,670</StatNumber>
                                <StatHelpText>
                                    <StatArrow type='increase' />
                                    23.36%
                                </StatHelpText>
                            </Stat>

                            <Stat>
                                <StatLabel>Expenses</StatLabel>
                                <StatNumber>FCFA 450,000</StatNumber>
                                <StatHelpText>
                                    <StatArrow type='decrease' />
                                    9.05%
                                </StatHelpText>
                            </Stat>
                        </StatGroup>
                    </div>
                </div>
            </main>
        </PageLayout>
    )
}