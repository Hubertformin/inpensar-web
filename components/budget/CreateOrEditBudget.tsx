import React from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Data } from "../../data";
import CategoriesMultiSelectModal from "../categories/CategoriesMultiSelectModal";
import CategoryChipMultiSelect from "../categories/CategoryChipMultiSelect";
import { removeCategory } from "../../utils/category";
import styles from "../../styles/CreateBudget.module.scss";
import { Field, Form, Formik } from "formik";
import { BudgetModel } from "../../models/budget.model";
import useApi from "../../hooks/useApi";

interface CreateBudgetProps {
  open: boolean;
  budget?: BudgetModel;
  onClose: () => void;
}

export default function CreateOrEditBudgetForm({ open, budget = null, onClose }: CreateBudgetProps) {
  const disclosure = useDisclosure();
  const [categories, setCategories] = React.useState([]);
  const [operation, setOperation] = React.useState<'ADD' | 'EDIT'>('ADD');
  const [isCategorySelectModalOpen, setIsCategorySelectModalOpen] =
    React.useState(false);
  const toast = useToast();
  const api = useApi();

  const openModal = React.useCallback(() => {
    /* if (!disclosure.isOpen) {
             // set initial date of date controls to today
             // this is done because when the user opens the modal the default value should be the current date and time
             // ! DO NOT ADD `resetForms` function the dependency array, it will cause infinite re-renders
             resetForms();
         }*/
    disclosure.onOpen();
  }, [disclosure]);

  React.useEffect(() => {
    if (open) {
      // open modal
      openModal();
    } else {
      disclosure.onClose();
    }
    // if budget was passed, set the mode to edit
    if (budget && categories.length == 0) {
      setOperation('EDIT');
      setCategories(budget.categories || []);
    }
  }, [disclosure, open, openModal]);

  const closeModal = () => {
    disclosure.onClose();
    if (onClose) {
      onClose();
    }
  };

  const validateRequired = (label, value) => {
    let error;
    if (!value) {
      error = `Please insert a valid ${label}`;
    }
    return error;
  };

  const onCategoriesSelect = (categories) => {
    setCategories(categories);
  };

  const addOrEditBudget = (values, actions) => {
    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2));
    //   actions.setSubmitting(false);
    // }, 1000);
    // if categories have not been set
    if (categories.length < 1) {
      toast({
        title: "Please select at least one category",
        status: "warning",
        isClosable: true,
      });
      actions.setSubmitting(false);
      return;
    }

    actions.setSubmitting(false);
    // construct budget .data
    let budgetData: BudgetModel;

    // add to database
    let process: Promise<any>;
    if (operation == 'ADD') {
      budgetData = {
        name: values.name,
        amount: Number(values.amount),
        amountSpent: budget ? budget.amountSpent : 0,
        shouldResetEveryMonth: values.shouldResetEveryMonth,
        categories,
      };
      process = api.addBudget(budgetData);
    } else {
      budgetData = {
        ...budget,
        name: values.name,
        amount: Number(values.amount),
        shouldResetEveryMonth: values.shouldResetEveryMonth,
        categories,
      };
      process = api.updateBudget(budgetData);
    }

    process.then(() => {
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "We are unable to save your budget",
          status: "error",
          isClosable: true,
        });
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  return (
    <>
      <Modal
        onClose={closeModal}
        isOpen={disclosure.isOpen}
        size="4xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
        blockScrollOnMount={false}
        colorScheme={"purple"}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              name: budget ? budget.name : "",
              amount: budget ?  budget.amount : "",
              shouldResetEveryMonth: budget ? budget.shouldResetEveryMonth : true,
            }}
            onSubmit={addOrEditBudget}
          >
            {(props) => (
              <Form>
                <ModalHeader>{budget ? `Edit ${budget.name}` : 'Create an expense budget'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody style={{ padding: "0 15px" }} className="pb-32">
                  <div className={`row pt-6 ${styles.formContainer}`}>
                    <div className="col-sm-7 border-r">
                      <FormControl className="mb-6">
                        <FormLabel>Select Categories</FormLabel>
                        <CategoryChipMultiSelect
                          options={removeCategory(
                            Data.expense_categories,
                            "Other"
                          )}
                          selectedOptions={budget ? budget.categories : []}
                          optionProps={{
                            icon: "icon",
                            label: "name",
                          }}
                          onChange={onCategoriesSelect}
                        />
                        <FormHelperText>
                          Select the expense categories to which this budget
                          will be applied
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className="col-sm-5">
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
                            <Input {...field} placeholder="Enter budget name" />
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
                            <FormLabel>Amount</FormLabel>
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
                      <Field name="shouldResetEveryMonth">
                        {({ field, form }) => (
                          <FormControl className="mt-2">
                            <Checkbox size={'lg'} {...field}>
                              This budget resets every month
                            </Checkbox>
                          </FormControl>
                        )}
                      </Field>
                      {/* <Accordion pt={6} allowToggle>
                        <AccordionItem>
                          <h2>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                Advanced setup
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4} pl={2} pr={2}>
                            <div className="flex justify-between mb-2 px-2 items-center">
                              <div className="">
                                <h2 className="text-lg font-medium text-slate-800">
                                  Receive alert
                                </h2>
                                <p className="text-slate-500 text-md">
                                  Receive alert when it reaches some point.
                                </p>
                              </div>
                              <div className="w-100">
                                <Field name="notifyOnPercent">
                                  {({ field, form }) => (
                                    <FormControl>
                                    <Checkbox  {...field}>Checkbox</Checkbox>
                                      <Switch
                                        {...field}
                                        colorScheme="purple"
                                        size="md"
                                      />
                                    </FormControl>
                                  )}
                                </Field>
                              </div>
                            </div>

                            <Field name="notificationPercent">
                              {({ field, form }) => (
                                <Box pt={6} pb={2} pl={4} pr={4}>
                                  <Slider
                                    aria-label="slider-ex-6"
                                    onChange={form.handleChange}
                                  >
                                    <SliderMark
                                      value={field.value}
                                      textAlign="center"
                                      bg="purple.500"
                                      color="white"
                                      mt="-10"
                                      ml="-5"
                                      w={"12"}
                                    >
                                      {field.value}%
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bg="purple.400" />
                                    </SliderTrack>
                                    <SliderThumb bg={"purple.800"} />
                                  </Slider>
                                </Box>
                              )}
                            </Field>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion> */}

                      {/* <FormControl className="mb-4">
                <FormLabel>Categories</FormLabel>
                <Button onClick={() => setIsCategorySelectModalOpen(true)}>
                  Select Categories
                </Button>
              </FormControl> */}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
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
      {/*    other modals*/}
      <CategoriesMultiSelectModal
        open={isCategorySelectModalOpen}
        onClose={() => setIsCategorySelectModalOpen(false)}
      />
    </>
  );
}
