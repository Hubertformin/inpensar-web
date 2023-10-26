import ViewLayout from "../../components/nav/ViewLayout";
import useApi from "../../hooks/useApi";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUserState } from "../../store/slices/auth.slice";
import { ProjectModel } from "../../models/project.model";
import {
    Avatar,
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
    ModalOverlay,
    Select,
    Skeleton,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { formatDate } from "../../utils/date";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import { AccountType } from "../../models/accounts.model";
import { selectProjectState, setActiveProjectId, setActiveProjectState } from "../../store/slices/projects.slice";
import { use } from "chai";

export default function ProjectsHome() {
    const api = useApi();
    const router = useRouter();
    const authUser = useSelector(selectAuthUserState);
    const projects = useSelector(selectProjectState);
    const newProjectDisclosure = useDisclosure();
    const toast = useToast();
    const dispatch = useDispatch();
    const [hasLoadedProjects, setHasLoadedProjects] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);

    React.useEffect(() => {
        if (authUser._id && projects.length == 0 && !hasLoadedProjects) {
            setIsPageLoading(true);

            api.getProjects()
                .then((data) => {
                    setHasLoadedProjects(true);
                })
                .finally(() => {
                    setIsPageLoading(false);
                });
        }
    }, [authUser._id, projects.length, api]);

    const validateRequired = (label, value) => {
        let error;
        if (!value) {
            error = `Please insert a valid ${label}`;
        }
        return error;
    };

    const closeModal = () => {
        newProjectDisclosure.onClose();
    };

    const addProject = (values, actions) => {
        // Add to project
        api.addProject(values)
            .then((data) => {
                // close modal
                closeModal();
            })
            .catch((err) => {
                console.error(err);
                toast({
                    title: "We are unable to save your new project",
                    status: "error",
                    isClosable: true,
                });
            })
            .finally(() => {
                actions.setSubmitting(false);
            });
    };

    const loadProject = async (project) => {
        await dispatch(setActiveProjectState(project));
        await dispatch(setActiveProjectId(project.id));

        router.push(`/projects/${project.id}/dashboard`);
    };

    return (
        <ViewLayout pageTitle={"Projects"}>
            <h1 className="font-bold md:text-3xl mb-6">Projects</h1>
            {isPageLoading ? (
                <PageLoadingSchema />
            ) : (
                <div className="body md:flex">
                    {projects.map((project, index) => {
                        return (
                            <div key={index} onClick={() => loadProject(project)} className="border cursor-pointer w-full md:w-1/4 rounded min-h-100 md:mr-4 mb-4 px-4 py-3">
                                <div className="flex items-center gap-1 mb-3">
                                    <Avatar size={"sm"} colorScheme={"teal"} name={project.name} />
                                    <p className="font-semibold text-lg">{project.name}</p>
                                </div>
                                <p className="m-0 text-slate-500 text-sm">{formatDate(project.createdAt)}</p>
                            </div>
                        );
                    })}
                    <div
                        onClick={() => newProjectDisclosure.onOpen()}
                        className="border w-full md:w-1/3 xl:w-24 cursor-pointer text-slate-500 rounded border-dotted min-h-100 flex items-center justify-center md:mr-4 mb-4 px-4 py-3"
                    >
                        <AiOutlinePlus size={32} />
                    </div>
                </div>
            )}

            <Modal onClose={closeModal} isOpen={newProjectDisclosure.isOpen} size="sm" closeOnOverlayClick={false} closeOnEsc={false} colorScheme={"brand"} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <Formik
                        initialValues={{
                            name: "",
                            description: "",
                        }}
                        onSubmit={addProject}
                    >
                        {(props) => (
                            <Form>
                                <ModalHeader>{"Add a new Project"}</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody style={{ padding: "0 15px" }} className="pb-32">
                                    <Field name="name" validate={(val) => validateRequired("name", val)}>
                                        {({ field, form }) => (
                                            <FormControl className="mb-4" isInvalid={form.errors.name && form.touched.name}>
                                                <FormLabel>Name</FormLabel>
                                                <Input {...field} placeholder="Enter Project Name" />
                                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </ModalBody>
                                <ModalFooter>
                                    <ButtonGroup spacing={4}>
                                        <Button type="button" onClick={closeModal}>
                                            Cancel
                                        </Button>
                                        <Button loadingText={"Saving.."} isLoading={props.isSubmitting} type="submit" colorScheme="brand">
                                            Save
                                        </Button>
                                    </ButtonGroup>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </ModalContent>
            </Modal>
        </ViewLayout>
    );
}

function PageLoadingSchema() {
    return (
        <div className={""}>
            <div className="row mb-10">
                <div className="col-sm-4">
                    <Skeleton height={"105px"} />
                </div>
                <div className="col-sm-4">
                    <Skeleton height={"105px"} />
                </div>
                <div className="col-sm-4">
                    <Skeleton height={"105px"} />
                </div>
            </div>
        </div>
    );
}
