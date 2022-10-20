import React from "react";
import {Field, Form, Formik} from "formik";
import {Button, FormControl, FormLabel, Input} from "@chakra-ui/react";
import {FcGoogle} from "react-icons/fc";
import styles from '../../styles/Auth.module.scss';
import Link from "next/link";

export default function LoginView() {
    React.useEffect(() => {

    }, []);

    const validateRequired = (label, value) => {
        let error;
        if (!value) {
            error = `Please insert a valid ${label}`;
        }
        return error;
    };

    const onLogin = (values, action) => {}


    return (
        <main className={`${styles.pageView}`}>
            <div className={`${styles.pageOverlay}`}>
                <div className={`${styles.formContainer} p-3`}>
                    <div className={`${styles.form} pb-8 pt-6 px-8`}>
                        <img src="/images/logotype.png" alt="" className={`${styles.logoImage} mb-6`} />
                        <h2 className="text-2xl md:text-3xl mb-8 font-bold">Welcome Back</h2>
                        <Formik
                            initialValues={{
                                email: '',
                                password: ''
                            }}
                            onSubmit={onLogin}
                        >
                            {(props) => (
                                <Form>
                                    <Field name="email" validate={(val) => validateRequired("email", val)}>
                                        {({field, form}) => (
                                            <FormControl className={'mb-5'}>
                                                <FormLabel>Email</FormLabel>
                                                <Input {...field} placeholder="Enter email" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="password" validate={(val) => validateRequired("password", val)}>
                                        {({field, form}) => (
                                            <FormControl className={'mb-8'}>
                                                <FormLabel>Password</FormLabel>
                                                <Input {...field} placeholder="Enter email" type="password" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <FormControl>
                                        <Button colorScheme={'purple'} className={'w-full'}>Login</Button>
                                    </FormControl>
                                </Form>
                            )}
                        </Formik>
                        <p className="mt-4 text-sm text-center">
                            Don't have an account?&nbsp;
                            <Link href='/auth/create-account'>
                                <strong className="text-purple-500 cursor-pointer hover:underline">Create Account</strong>
                            </Link>
                        </p>
                    </div>
                    <div className={`${styles.formImage}`}></div>
                </div>
            </div>
        </main>
    );
}