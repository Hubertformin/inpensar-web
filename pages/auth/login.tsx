import React from "react";
import { Field, Form, Formik } from "formik";
import { Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import styles from "../../styles/Auth.module.scss";
import Link from "next/link";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { fireAuth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import useApi from "../../hooks/useApi";

export default function LoginView() {
    const toast = useToast();
    const router = useRouter();
    const api = useApi();
    React.useEffect(() => {}, []);

    const validateRequired = (label, value) => {
        let error;
        if (!value) {
            error = `Please insert a valid ${label}`;
        }
        return error;
    };

    const onLogin = (values, actions) => {
        const { email, password } = values;
        signInWithEmailAndPassword(fireAuth, email, password)
            .then((userCred) => userCred.user.getIdToken())
            .then((idToken) => {
                api.getAndSetCurrentUsersData({ idToken }).then((projects) => {
                    router.push(`/projects/`);
                });
            })
            .catch((e) => {
                console.dir(e);
                // If account data does not exist, redirect the user to complete is account
                if (e.response.status === 404) {
                    router.push("/auth/complete-account");
                } else {
                    toast({
                        title: "Opps! we couldn't sign you in",
                        description: formatFirebaseErrorMessages(e.toString()),
                        status: "error",
                    });
                    actions.setSubmitting(false);
                }
            });
    };

    return (
        <main className={`${styles.pageView}`}>
            <div className={`${styles.pageOverlay}`}>
                <div className={`${styles.formContainer} md:p-3`}>
                    <div className={`${styles.form} pb-8 pt-6 px-4 md:px-8`}>
                        <img src="/images/sunshine_logo.png" alt="" className={`${styles.logoImage} mb-6`} />
                        <h2 className="text-2xl md:text-3xl mb-8 font-bold">Welcome Back</h2>
                        <Formik
                            initialValues={{
                                email: "",
                                password: "",
                            }}
                            onSubmit={onLogin}
                        >
                            {(props) => (
                                <Form>
                                    <Field name="email" validate={(val) => validateRequired("email", val)}>
                                        {({ field, form }) => (
                                            <FormControl className={"mb-5"}>
                                                <FormLabel>Email</FormLabel>
                                                <Input {...field} placeholder="Enter email" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="password" validate={(val) => validateRequired("password", val)}>
                                        {({ field, form }) => (
                                            <FormControl className={"mb-8"}>
                                                <FormLabel>Password</FormLabel>
                                                <Input {...field} placeholder="Enter password" type="password" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <FormControl>
                                        <Button type="submit" colorScheme={"brand"} className={"w-full"} isLoading={props.isSubmitting} loadingText="Signing in..">
                                            Login
                                        </Button>
                                    </FormControl>
                                </Form>
                            )}
                        </Formik>
                        <p className="mt-4 text-sm flex justify-center items-center text-center">
                            Don&apos;t have an account?&nbsp;
                            <Link href="/auth/create-account">
                                <Button variant="link" colorScheme={"brand"}>
                                    Create Account
                                </Button>
                            </Link>
                        </p>
                    </div>
                    <div className={`${styles.formImage}`}></div>
                </div>
            </div>
        </main>
    );
}

function formatFirebaseErrorMessages(firebaseMsg: string): string {
    if (firebaseMsg.includes("auth/network-request-failed")) {
        return "Your internet connection is unstable, Please switch networks or try again later";
    } else if (firebaseMsg.includes("auth/wrong-password")) {
        return "Your password is incorrect";
    } else {
        return "There was an error signing you into your account. Please try again later";
    }
}
