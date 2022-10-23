import React from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button, FormControl, FormErrorMessage, FormLabel, Input, useToast} from "@chakra-ui/react";
import {FcGoogle} from "react-icons/fc";
import styles from '../../styles/Auth.module.scss';
import Link from "next/link";
import axios from "axios";
import Select from "react-select";
import {getSelectOptions} from "../../utils/array";
import useApi from "../../hooks/useApi";
import {useRouter} from "next/router";

export default function CreateAccountView() {
    const [countries, setCountries] = React.useState<any[]>([]);
    const [currencies, setCurrencies] = React.useState<any[]>([]);
    const [selectedCurrencyControl, setSelectedCurrencyControl] = React.useState<{ label: string, value: string }>();
    const api = useApi();
    const router = useRouter();
    const toast = useToast();

    React.useEffect(() => {
        getCountriesAndCurrencies();
    }, []);

    const validateRequired = (label, value) => {
        let error;
        if (!value) {
            error = `Please insert a valid ${label}`;
        }
        return error;
    };

    function validateConfirmPasswordInput(pass, value) {
        if (!value) {
            return 'Please confirm your password';
        }
        if (pass && value) {
            if (pass !== value) {
                return 'Passwords do not match';
            }
        }
        return null;
    }

    const getCountriesAndCurrencies = async () => {
        const [countries, currencies] = await Promise.all([
            axios.get('https://restcountries.com/v2/all?fields=name,currencies,alpha2Code'),
            axios.get('https://openexchangerates.org/api/currencies.json'),
        ]);
        setCountries(countries.data);
        const _currencies = Object.keys(currencies.data).map(key => ({name: currencies.data[key], code: key}));
        setCurrencies(_currencies);

    }


    function onCountrySelect(val, setFieldValue) {
        const country = countries.find(country => country.alpha2Code === val.value);
        const _selectedCurrency = currencies.find(c => c.code === country.currencies[0].code);

        setFieldValue('country', country);
        if (_selectedCurrency) {
            setFieldValue('currency',{label: _selectedCurrency.name, value: _selectedCurrency.code});
            setSelectedCurrencyControl(() => ({label: _selectedCurrency.name, value: _selectedCurrency.code}));
        }
    }

    function onCurrencySelect(currency, setFieldValue ) {
        setSelectedCurrencyControl(currency);
        setFieldValue('currency', currency);
    }

    const onCreateAccount = (values, actions: FormikHelpers<any>) => {
        values['country'] = countries.find(country => country.alpha2Code == values.country.alpha2Code);
        values['currency'] = currencies.find(currency => currency.code == values.currency.value);

        api.createUserAccount(values)
            .then((data) => {
                (data);
                // route to transactions list
                router.push(`/projects/${data.project.id}/transactions`)
            }).catch((e) => {
                console.error(e);
                toast({
                    title: 'We are unable to create your account',
                    description: e.response?.data?.message || 'There was an error creating your account. Please try again later',
                    status: 'error'
                });
            actions.setSubmitting(false);
        });
    }

    return (
        <main className={`${styles.pageView}`}>
            <div className={`${styles.pageOverlay}`}>
                <div className={`${styles.createAccountForm} p-3`}>
                    <div className={`${styles.form} pb-8 pt-6 px-6`}>
                        <img src="/images/logotype.png" alt="" className={`${styles.logoImage} mb-6`}/>
                        <h2 className="text-2xl md:text-3xl mb-8 font-bold">Get started.</h2>
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                                country: '',
                                currency: ''
                            }}
                            onSubmit={onCreateAccount}
                        >
                            {(props) => (
                                <Form>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Field name="name" validate={(val) => validateRequired("name", val)}>
                                                {({field, form}) => (
                                                    <FormControl
                                                        className={'mb-5'}
                                                        isInvalid={form.errors.name && form.touched.name}
                                                    >
                                                        <FormLabel>Name</FormLabel>
                                                        <Input {...field} placeholder="Enter name"/>
                                                        <FormErrorMessage>
                                                            {form.errors.name}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="col-sm-6">
                                            <Field name="email" validate={(val) => validateRequired("email", val)}>
                                                {({field, form}) => (
                                                    <FormControl
                                                        className={'mb-5'}
                                                        isInvalid={form.errors.email && form.touched.email}
                                                    >
                                                        <FormLabel>Email</FormLabel>
                                                        <Input {...field} placeholder="Enter email" type="email"/>
                                                        <FormErrorMessage>
                                                            {form.errors.email}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Field name="password"
                                                   validate={(val) => validateRequired("password", val)}
                                            >
                                                {({field, form}) => (
                                                    <FormControl
                                                        className={'mb-8'}
                                                        isInvalid={form.errors.password && form.touched.password}
                                                    >
                                                        <FormLabel>Password</FormLabel>
                                                        <Input {...field} placeholder="Enter password" type="password"/>
                                                        <FormErrorMessage>
                                                            {form.errors.password}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="col-sm-6">
                                            <Field name="confirmPassword"
                                                   validate={(val) => validateConfirmPasswordInput(props.values.password, val)}
                                            >
                                                {({field, form}) => (
                                                    <FormControl
                                                        className={'mb-8'}
                                                        isInvalid={form.errors.confirmPassword && form.touched.confirmPassword}
                                                    >
                                                        <FormLabel>Confirm Password</FormLabel>
                                                        <Input {...field} placeholder="Confirm password"
                                                               type="password"/>
                                                        <FormErrorMessage>
                                                            {form.errors.confirmPassword}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-6">
                                            <Field name="country" validate={(val) => validateRequired("country", val)}>
                                                {({field, form}) => (
                                                    <FormControl
                                                        className={'mb-8'}
                                                        isInvalid={form.errors.country && form.touched.country}
                                                    >
                                                        <FormLabel>Country</FormLabel>
                                                        <Select
                                                            options={getSelectOptions(countries, 'name', 'alpha2Code')}
                                                            placeholder={'Select your country'}
                                                            onChange={(val) => onCountrySelect(val, props.setFieldValue)}
                                                        />
                                                        <FormErrorMessage>
                                                            {form.errors.country}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="col-sm-6">
                                            <Field name="currency"
                                                   validate={(val) => validateRequired("currency", val)}>
                                                {({field, form}) => (
                                                    <FormControl
                                                        className={'mb-8'}
                                                        isInvalid={form.errors.currency && form.touched.currency}>
                                                        <FormLabel>Currency</FormLabel>
                                                        <Select
                                                            value={selectedCurrencyControl}
                                                            options={getSelectOptions(currencies, 'name', 'code')}
                                                            placeholder={'Select your currency'}
                                                            onChange={(val) => onCurrencySelect(val, props.setFieldValue)}
                                                        />
                                                        <FormErrorMessage>
                                                            {form.errors.currency}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </div>
                                    </div>

                                    <FormControl>
                                        <Button type="submit" isLoading={props.isSubmitting} loadingText={'Creating account..'} colorScheme={'purple'} className={'w-full'}>Create
                                            Account</Button>
                                    </FormControl>
                                </Form>
                            )}
                        </Formik>
                        <p className="mt-4 text-sm text-center">
                            Have an account?&nbsp;
                            <Link href='/auth/login'>
                                <strong className="text-purple-500 cursor-pointer hover:underline">Login</strong>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}