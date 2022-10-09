import React from "react";
import {Form} from "formik";
import {Button, FormControl, FormLabel, Input} from "@chakra-ui/react";
import {FcGoogle} from "react-icons/fc";

export default function Auth() {
    React.useEffect(() => {
        const container = document.getElementById('auth-container');
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');

        signUpButton.addEventListener('click', () => {
            container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
            container.classList.remove("right-panel-active");
        });
    }, []);


    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <div className="auth-container" id="auth-container">
                <div className="form-container px-6 py-6 sign-up-container">
                    <form action="#">
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <FormControl className={'mb-3'}>
                            <FormLabel>Name</FormLabel>
                            <Input placeholder="Enter name" />
                        </FormControl>
                        <FormControl className={'mb-3'}>
                            <FormLabel>Email</FormLabel>
                            <Input placeholder="Enter email" />
                        </FormControl>
                        <FormControl className={'mb-3'}>
                            <FormLabel>Create password</FormLabel>
                            <Input placeholder="Enter password" />
                        </FormControl>
                        <Button>Create Account</Button>
                    </form>
                </div>
                <div className="form-container p-6 sign-in-container">
                    <form action="#">
                        <h1 className={'text-center font-bold text-2xl mb-4'}>Sign in</h1>
                        <div className="social-container">
                            <div className="border px-4 py-2 flex justify-content-center rounded-3xl w-auto">
                                <FcGoogle size={24} /> <span>Continue with Google</span>
                            </div>
                        </div>
                        <span className={'text-center block'}>or use your account</span>
                        <FormControl className={'mb-3'}>
                            <FormLabel>Email</FormLabel>
                            <Input placeholder="Enter email" />
                        </FormControl>
                        <FormControl className={'mb-3'}>
                            <FormLabel>Create password</FormLabel>
                            <Input placeholder="Enter password" />
                        </FormControl>
                        <Button colorScheme="purple">Login</Button>
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" id="signUp">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}