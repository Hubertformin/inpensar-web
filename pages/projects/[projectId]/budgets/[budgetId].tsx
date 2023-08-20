import ProjectViewLayout from "../../../../components/nav/ProjectViewLayout";
import React from "react";
import {useRouter} from "next/router";
import {BudgetModel} from "../../../../models/budget.model";
import {useSelector} from "react-redux";
import {selectBudgetState} from "../../../../store/slices/budget.slice";
import styles from '../../../../styles/BudgetDetail.module.scss';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Avatar,
    Button,
    ButtonGroup, Tab, TabList, Tabs, Tag, TagLabel,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {HiOutlinePencil} from "react-icons/hi";
import {MdOutlineDeleteOutline} from "react-icons/md";
import useApi from "../../../../hooks/useApi";
import {calculateBudgetBalance, calculateBudgetExpenditurePercentage} from "../../../../utils/budget";
import {RiErrorWarningFill} from "react-icons/ri";
import {convertHexToRGBA} from "../../../../utils/colors";
import {TbLayoutList} from "react-icons/tb";
import CreateOrEditBudgetForm from "../../../../components/budget/CreateOrEditBudget";
import useUtils from "../../../../hooks/useUtils";

export default function BudgetDetail() {
    const utils = useUtils();
    const router = useRouter();
    const cancelRef = React.useRef();
    const deleteDisclosure = useDisclosure();
    const {budgetId} = router.query
    const [currentBudget, setCurrentBudget] = React.useState<BudgetModel>();
    const budgets: BudgetModel[] = useSelector(selectBudgetState);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const api = useApi();
    const [expenditurePercent, setExpenditurePercent] = React.useState(0);
    const [isExceeded, setIsExceeded] = React.useState(false);
    const toast = useToast();

    React.useEffect(() => {
        const _currentBudget = budgets.find(b => b._id == budgetId);
        if (_currentBudget) {
            setCurrentBudget(_currentBudget);
            setExpenditurePercent(calculateBudgetExpenditurePercentage(_currentBudget));
            setIsExceeded(_currentBudget.amountSpent > _currentBudget.amount);
        }
    }, [budgets, budgetId]);

    const deleteBudget = () => {
        setIsDeleting(true)
        api.deleteBudget(currentBudget)
            .then(() => {
                router.back();
            }).catch(err => {
                toast({
                    title: "We were unable to delete this budget",
                    status: "warning",
                    isClosable: true,
                });
        })
    }

    return (
        <ProjectViewLayout title={`${currentBudget?.name || 'Budget'} Details`}>
            <main className="page-view px-8 py-6">
                <div className="toolbar mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-2xl">{currentBudget?.name}</h1>
                    <ButtonGroup spacing={0}>
                        <Button
                            colorScheme="brand"
                            variant="ghost"
                            leftIcon={<HiOutlinePencil/>}
                            onClick={() => setEditModalOpen(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            colorScheme="red"
                            variant="ghost"
                            onClick={deleteDisclosure.onOpen}
                            leftIcon={<MdOutlineDeleteOutline/>}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </div>
                {currentBudget &&
                    (<div className="amount-info pt-8">
                        <h1 className="text-4xl mb-3 font-bold"
                            style={{color: currentBudget?.color}}>{utils.formatCurrency(currentBudget?.amount)}</h1>
                        {
                            (currentBudget?.amountSpent < currentBudget?.amount) ?
                                <h1 className="text-lg font-bold">{utils.formatCurrency(calculateBudgetBalance(currentBudget))} left to
                                    spend</h1> :
                                <h1 className="text-lg font-bold flex items-center gap-2 text-red-80">
                                    <RiErrorWarningFill/> You have exceeded this budget</h1>
                        }
                        <div className="amount-spent-info">
                            <div className="flex justify-between pt-4">
                                <p className="text-lg text-slate-600">Spent <strong>{utils.formatCurrency(currentBudget?.amountSpent)}</strong> of <strong>{utils.formatCurrency(currentBudget?.amount)}</strong> </p>
                                <p className="text-lg font-bold text-slate-600">{expenditurePercent}%</p>
                            </div>
                            <div className="progress mt-2">
                                <div className={`${styles.containerStyles} mb-4`}>
                                    <div
                                        style={{
                                            backgroundColor: convertHexToRGBA(currentBudget.color, 1),
                                            width: `${expenditurePercent}%`
                                        }}
                                        className={`${styles.fillerStyles} ${
                                            expenditurePercent > 80 ? styles.fillerExceeded : ""
                                        }`}
                                    ></div>
                                    <p className={`${styles.warningLine}`}></p>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
                {
                    currentBudget?.categories &&
                    <div className="categories pt-4">
                        <h2 className="tex-2xl font-bold mb-3">Categories</h2>
                        <CategoryChips categories={currentBudget.categories} />
                    </div>
                }
                <Tabs colorScheme={"purple"} className={'mt-4'}>
                    <TabList>
                        <Tab name="all">
                            <TbLayoutList size={24} />
                            &nbsp;Recent Transactions
                        </Tab>
                    </TabList>
                </Tabs>
            </main>
            {/*    modals*/}
            <AlertDialog
                isOpen={deleteDisclosure.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={deleteDisclosure.onClose}
                isCentered={true}
                blockScrollOnMount={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete this Budget
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can&apos;t undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={deleteDisclosure.onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                ml={3}
                                loadingText={"Deleting.."}
                                isLoading={isDeleting}
                                onClick={deleteBudget}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {/* Budget   modals*/}
            <CreateOrEditBudgetForm
                open={editModalOpen}
                budget={currentBudget}
                onClose={() => setEditModalOpen(false)}
            />
        </ProjectViewLayout>
    )
}

function CategoryChips({categories}) {
    return (
        <>
            {
                categories.map((category, index) => {
                    return (<Tag
                        size="lg"
                        borderRadius="full"
                        mr={3}
                        mb={3}
                        key={`category-item-${index}`}
                    >
                        <Avatar
                            src={category.icon}
                            size="xs"
                            name={category['name']}
                            ml={-1}
                            mr={2}
                        />
                        <TagLabel>
                            {category['name']}
                        </TagLabel>
                    </Tag>)
                })
            }
        </>
    )
}
