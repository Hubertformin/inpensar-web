import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    ButtonGroup,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Select,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import React from "react";
import {AccountsModel, AccountType} from "../../models/accounts.model";
import useApi from "../../hooks/useApi";


interface CreateAccontProps {
    open: boolean;
    account?: AccountsModel;
    onClose: () => void;
}

export default function CreateOrEditAccount({ open, account = null, onClose }: CreateAccontProps) {
    const disclosure = useDisclosure();
    const cancelRef = React.useRef();
    const deleteDisclosure = useDisclosure();
    const [isDeleting, setIsDeleting] = React.useState(false);
    const api = useApi();
    const toast = useToast();

    React.useEffect(() => {
        if (open) {
            // open modal
            disclosure.onOpen();
        } else {
            disclosure.onClose();
        }
        // if account was passed, set the mode to edit

    }, [disclosure, open, account]);

    const validateRequired = (label, value) => {
        let error;
        if (!value) {
            error = `Please insert a valid ${label}`;
        }
        return error;
    };

    const closeModal = () => {
        disclosure.onClose();
        if (onClose) {
            onClose();
        }
    };

    const addOrEditAccount = (values, actions) => {
        let _account: AccountsModel;

        let promise: Promise<any>;
        if (account) {
            _account = {
                ...account,
                ...values,
                amount: parseInt(values.amount)
            }
            promise =  api.updateAccount(_account)
        } else {
            _account = {
                ...values,
                amount: parseInt(values.amount)
            };
            promise = api.addAccount(_account);
        }

        promise
            .then(() => {
                closeModal();
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "We are unable to save your account",
                    status: "error",
                    isClosable: true,
                });
            })
            .finally(() => {
                actions.setSubmitting(false);
            });
    }

    function deleteAccount() {
        setIsDeleting(true);
        api.deleteAccount(account)
            .then(() => {
                closeModal();
            })
            .catch((err) => {
                console.log(err);
                toast({
                    title: "We are unable to delete this account",
                    description: err?.response?.data?.errorText || 'Something went wrong, Please try again later',
                    status: "error",
                    isClosable: true,
                });
            })
            .finally(() => {
                setIsDeleting(false);
                deleteDisclosure.onClose();
            })
    }

    return (
        <>
        <Modal
            onClose={closeModal}
            isOpen={disclosure.isOpen}
            size="sm"
            closeOnOverlayClick={false}
            closeOnEsc={false}
            colorScheme={"purple"}
            isCentered={true}
        >
            <ModalOverlay />
            <ModalContent>
                <Formik
                    initialValues={{
                        name: account ? account.name : "",
                        amount: account ?  account.amount : '',
                        type: account ?  account.type : AccountType.CHECKING,
                    }}
                    onSubmit={addOrEditAccount}
                >
                    {(props) => (
                        <Form>
                            <ModalHeader>{account ? `Edit ${account.name}` : 'Add an account'}</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody style={{ padding: "0 15px" }} className="pb-32">
                                    <Field
                                        name="name"
                                        validate={(val) => validateRequired("name", val)}
                                    >
                                        {({ field, form }) => (
                                            <FormControl
                                                className="mb-4"
                                                isInvalid={form.errors.name && form.touched.name}
                                            >
                                                <FormLabel>Name</FormLabel>
                                                <Input {...field} placeholder="Enter account name" />
                                                <FormErrorMessage>
                                                    {form.errors.name}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field
                                        name="amount"
                                        validate={(val) => validateRequired("amount", val)}
                                    >
                                        {({ field, form }) => (
                                            <FormControl
                                                className="mb-4"
                                                isInvalid={
                                                    form.errors.amount && form.touched.amount
                                                }
                                            >
                                                <FormLabel>Initial balance</FormLabel>
                                                <InputGroup>
                                                    <InputLeftAddon bg={'purple.100'} color={'purple.500'}>FCFA</InputLeftAddon>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Enter the amount"
                                                    />
                                                </InputGroup>
                                                <FormErrorMessage>
                                                    {form.errors.amount}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field
                                        name="type"
                                        validate={(val) => validateRequired("amount", val)}
                                    >
                                        {({ field, form }) => (
                                            <FormControl
                                                className="mb-4"
                                                isInvalid={
                                                    form.errors.type && form.touched.type
                                                }
                                            >
                                                <FormLabel>Account Type</FormLabel>
                                                <Select {...field}>
                                                    <option value={AccountType.CHECKING.toString()}>Checking</option>
                                                    <option value={AccountType.SAVINGS.toString()}>Savings</option>
                                                    <option value={AccountType.WALLET.toString()}>Wallet</option>
                                                </Select>
                                                <FormErrorMessage>
                                                    {form.errors.type}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                            </ModalBody>
                            <ModalFooter style={{...(account && {justifyContent: 'space-between'})}}>
                                {account && <Button colorScheme="red" onClick={deleteDisclosure.onOpen} variant="outline">Delete</Button>}
                                <ButtonGroup spacing={4}>
                                    <Button type="button" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        loadingText={"Saving.."}
                                        isLoading={props.isSubmitting}
                                        type="submit"
                                        colorScheme="purple"
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
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
                            Delete this Account
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
                                onClick={deleteAccount}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            </>
    )
}