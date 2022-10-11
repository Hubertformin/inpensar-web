import React from "react";
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Avatar,
    Button,
    ButtonGroup,
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {TransactionsModel, TransactionType} from "../models/transactions.model";
import TransactionAmount from "./TransactionAmount";
import {IoSyncOutline, IoWalletOutline} from "react-icons/io5";
import {formatCurrency} from "../utils/number";
import {formatDate} from "../utils/date";
import {BsArrowRightShort} from "react-icons/bs";
import useApi from "../hooks/useApi";

interface ViewTransactionDetailsProps {
    open: boolean,
    selectedTransaction: TransactionsModel,
    onClose: () => void,
}

export default function ViewTransactionDetails({ open, selectedTransaction, onClose }: ViewTransactionDetailsProps) {
    const disclosure = useDisclosure();
    const deleteDisclosure = useDisclosure();
    const cancelRef = React.useRef();
    const [isDeleting, setIsDeleting] = React.useState(false);
    const api = useApi();

    React.useEffect(() => {
        if (open) {
            disclosure.onOpen();
        } else {
            disclosure.onClose();
        }
    }, [open, selectedTransaction, disclosure])

    const closeModal = () => {
        disclosure.onClose();
        if (onClose) {
            onClose();
        }
    }

    const onDeleteTransaction = () => {
        setIsDeleting(true);
        api.deleteTransaction(selectedTransaction)
            .finally(() => {
                setIsDeleting(false);
                deleteDisclosure.onClose();
                closeModal();
            })
    }

    return (
        <>
        <Modal
            onClose={closeModal}
            isOpen={disclosure.isOpen}
            size="xl"
            closeOnOverlayClick={false}
            closeOnEsc={false}
            colorScheme={'purple'}
            isCentered={true}

        >
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Details</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <div className="head">
                        <div className="py-4 mb-4 flex items-center justify-between">
                            {
                                selectedTransaction?.type === TransactionType.TRANSFER ?
                                    (<div className="flex items-center space-x-4">
                                        <div className="shrink-0">
                                            <Avatar size="lg" bg="teal.500" icon={<IoSyncOutline size={32} />}/>
                                        </div>
                                        <div>
                                            <div className="text-xl font-medium text-black">
                                                <span>{selectedTransaction?.from.name}</span>
                                                <BsArrowRightShort size={24} className="inline-block mx-0" />
                                                <span>{selectedTransaction?.to.name}</span>
                                            </div>
                                            <p className="text-slate-500">{formatDate(selectedTransaction?.date)}</p>
                                        </div>
                                    </div>) :
                                    (
                                        <div className="flex items-center space-x-4">
                                            <div className="shrink-0">
                                                <Avatar size="lg" src={selectedTransaction?.category.icon}
                                                        name={selectedTransaction?.category.name}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-medium text-black">
                                                    {selectedTransaction?.category.name}
                                                </div>
                                                <p className="text-slate-500">{formatDate(selectedTransaction?.date)}</p>
                                            </div>
                                        </div>
                                    )
                            }
                            <TransactionAmount
                                iconSize={24}
                                transaction={selectedTransaction}
                                textStyle={{ fontSize: '22px', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>
                    <div className="actions flex">
                        <ButtonGroup spacing={0}>
                            <Button colorScheme="purple" variant="ghost">Edit</Button>
                            <Button colorScheme="red" variant="ghost" onClick={deleteDisclosure.onOpen}>Delete</Button>
                        </ButtonGroup>
                    </div>
                    <Divider />
                    <div className="body pt-8">
                        {selectedTransaction?.notes && <div className="item mb-6">
                            <p className="label font-bold text-sm mb-1">Notes</p>
                            <p className="mb-0">{selectedTransaction?.notes}</p>
                        </div>}
                        {selectedTransaction?.wallet && <div className="item mb-6">
                            <p className="label font-bold text-sm mb-1">Wallet</p>
                            <div className="flex space-x-4">
                                <div className="shrink-0">
                                    <Avatar icon={<IoWalletOutline size={24} />}
                                            bg="blackAlpha.100"
                                            color="black"
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-black">
                                        {selectedTransaction?.wallet.name}
                                    </div>
                                    <p className="text-sm text-slate-500">{formatCurrency(selectedTransaction?.wallet.amount)}</p>
                                </div>
                            </div>
                        </div>}
                    </div>
                </ModalBody>
                <ModalFooter>

                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
            <AlertDialog
                isOpen={deleteDisclosure.isOpen}
                leastDestructiveRef={cancelRef}
                onClose={deleteDisclosure.onClose}
                blockScrollOnMount={false}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete this transaction
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
                                onClick={onDeleteTransaction} ml={3}
                                loadingText={'Deleting..'}
                                isLoading={isDeleting}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}