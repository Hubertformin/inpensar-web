import React from "react";
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box,
    Button,
    ButtonGroup, Divider,
    FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Switch, Textarea, useDisclosure
} from "@chakra-ui/react";
import Select from "react-select";
import {Data} from "../../data";
import {getSelectOptions} from "../../utils/array";
import CategoriesMultiSelectModal from "../categories/CategoriesMultiSelectModal";

interface CreateBudgetProps {
    open: boolean;
    onClose: () => void
}

export default function CreateBudgetForm({open, onClose}: CreateBudgetProps) {
    const disclosure = useDisclosure();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCategorySelectModalOpen, setIsCategorySelectModalOpen] = React.useState(false);
    const [sliderValue, setSliderValue] = React.useState(50);

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
    }, [disclosure, open, openModal]);

    const closeModal = () => {
        disclosure.onClose();
        setIsLoading(false);
        if (onClose) {
            onClose();
        }
    };

    const addBudget = () => {

    }

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
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create Budget</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody style={{padding: '0 15px'}}>
                        <div className="row">
                            <div className="col-sm-8 px-6">
                                <div className="py-8 px-6">
                                    <FormControl className="mb-4">
                                        <FormLabel>Title</FormLabel>
                                        <Input
                                            placeholder="Enter title"
                                        />
                                    </FormControl>
                                    <FormControl
                                        className="mb-4"
                                    >
                                        <FormLabel>Amount</FormLabel>
                                        <InputGroup>
                                            <InputLeftAddon>FCFA</InputLeftAddon>
                                            <Input
                                                name="amount"
                                                type="number"
                                                placeholder="Amount"
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl className="mb-4">
                                        <FormLabel>Categories</FormLabel>
                                        <Button onClick={() => setIsCategorySelectModalOpen(true)}>Select
                                            Categories</Button>
                                        {/*<Select*/}
                                        {/*    closeMenuOnSelect={false}*/}
                                        {/*    isMulti*/}
                                        {/*    options={getSelectOptions(Data.expense_categories, 'name', '_id')} />*/}

                                    </FormControl>
                                    <Accordion pt={6} allowToggle>
                                        <AccordionItem>
                                            <h2>
                                                <AccordionButton>
                                                    <Box flex='1' textAlign='left'>
                                                        Advanced setup
                                                    </Box>
                                                    <AccordionIcon/>
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4} pl={2} pr={2}>
                                                <div className="flex justify-between mb-2 px-2 items-center">
                                                    <div className="">
                                                        <h2 className="text-lg font-medium text-slate-800">Receive
                                                            alert</h2>
                                                        <p className="text-slate-500 text-md">
                                                            Receive alert when it reaches some point.
                                                        </p>
                                                    </div>
                                                    <div className="w-100">
                                                        <FormControl>
                                                            <Switch colorScheme="purple" size='md'/>
                                                        </FormControl>
                                                    </div>
                                                </div>

                                                <Box pt={6} pb={2} pl={4} pr={4}>
                                                    <Slider aria-label='slider-ex-6'
                                                            onChange={(val) => setSliderValue(val)}>
                                                        <SliderMark
                                                            value={sliderValue}
                                                            textAlign='center'
                                                            bg='purple.500'
                                                            color='white'
                                                            mt='-10'
                                                            ml='-5'
                                                            w={'12'}
                                                        >
                                                            {sliderValue}%
                                                        </SliderMark>
                                                        <SliderTrack>
                                                            <SliderFilledTrack bg="purple.400"/>
                                                        </SliderTrack>
                                                        <SliderThumb bg={"purple.800"}/>
                                                    </Slider>
                                                </Box>
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>

                                </div>
                            </div>
                            <div className="col-sm-4 bg-gray-200"></div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing={4}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                loadingText={"Saving"}
                                isLoading={isLoading}
                                onClick={addBudget}
                                colorScheme="purple"
                            >
                                Save
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        {/*    other modals*/}
            <CategoriesMultiSelectModal open={isCategorySelectModalOpen} onClose={() => setIsCategorySelectModalOpen(false)} />
        </>
    );
}