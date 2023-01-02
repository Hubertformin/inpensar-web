import ViewLayout from "../components/nav/ViewLayout";
import {
    Button,
    FormControl, FormErrorMessage, FormHelperText,
    FormLabel,
    Input, Skeleton, Tab, TabList, TabPanel, TabPanels,
    Tabs,
    useToast
} from "@chakra-ui/react";
import styles from '../styles/SettingsHome.module.scss'
import {Field, Formik} from "formik";
import React from "react";
import useApi from "../hooks/useApi";
import {useSelector} from "react-redux";
import {selectAuthUserState} from "../store/slices/auth.slice";
import axios from "axios";
import {getSelectOption, getSelectOptions} from "../utils/array";
import Select from "react-select";
import {IoPersonOutline} from "react-icons/io5";
import {FiSettings} from "react-icons/fi";
import {useRouter} from "next/router";

export default function SettingsHome() {
    const [countries, setCountries] = React.useState<any[]>([]);
    const [currencies, setCurrencies] = React.useState<any[]>([]);
    const [defaultTabIndex, setDefaultTabIndex] = React.useState<number>(0);
    const [selectedCurrencyControl, setSelectedCurrencyControl] = React.useState<{ label: string, value: string }>();
    const [selectedCountryControl, setSelectedCountryControl] = React.useState<{ label: string, value: string }>();
    const [isPageLoading, setIsPageLoading] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const api = useApi();
    const toast = useToast();
    const authUser = useSelector(selectAuthUserState);
    const router = useRouter();

    React.useEffect(() => {
        console.log(router.query);
        if (router.query.t == 'settings') setDefaultTabIndex(1);
    },[])


    const getCountriesAndCurrencies = async () => {
        const [countries, currencies] = await Promise.all([
            axios.get('https://restcountries.com/v2/all?fields=name,currencies,alpha2Code'),
            axios.get('https://openexchangerates.org/api/currencies.json'),
        ]);

        setCountries(countries.data);
        const _currencies = Object.keys(currencies.data).map(key => ({name: currencies.data[key], code: key}));
        setCurrencies(_currencies);

        const userCountry = countries.data.find(c => c.alpha2Code.toLowerCase() == authUser.settings.country.toLowerCase());
        const userCurrency = _currencies.find(c => c.code == authUser.settings.currency);

        setSelectedCountryControl(getSelectOption(userCountry, 'name', 'alpha2Code'));
        setSelectedCurrencyControl(getSelectOption(userCurrency, 'name', 'code'));

        setIsPageLoading(false);
    }

    React.useEffect(() => {
        if (authUser._id && (countries.length == 0 || currencies.length == 0)) {
            getCountriesAndCurrencies();
        }
    }, [authUser, countries.length, currencies.length]);

    function onCountrySelect(val) {
        const country = countries.find(country => country.alpha2Code === val.value);
        setSelectedCountryControl(val);
        const _selectedCurrency = currencies.find(c => c.code === country.currencies[0].code);
        if (_selectedCurrency) {
            setSelectedCurrencyControl(() => ({label: _selectedCurrency.name, value: _selectedCurrency.code}));
        }
    }

    function onCurrencySelect(_currency) {
        setSelectedCurrencyControl(_currency);
        // const currency = currencies.find(currency => currency.code == _currency.value);
    }

    const saveUser = (values) => {
        setIsLoading(true);

        api.updateUser(authUser._id, values)
            .then(() => {
                toast({
                    title: 'Saved',
                    status: 'success'
                });
            })
            .catch((e) => {
                console.error(e);
                toast({
                    title: 'We are unable to update your profile',
                    description: e.response?.data?.message || 'There was an error updating your profile. Please try again later',
                    status: 'error'
                });
            }).finally(() => setIsLoading(false))
    }

    /**
     *
     * Save settings
     */
    const saveSettings = () => {
        // validate function
        const payload = {
            country: selectedCountryControl.value,
            language: authUser.settings.language,
            currency: selectedCurrencyControl.value,
        };

        setIsLoading(true);

        api.updateUserSettings(authUser._id, payload)
            .then(() => {
                toast({
                    title: 'Saved',
                    status: 'success'
                });
            })
            .catch((e) => {
                console.error(e);
                toast({
                    title: 'We are unable to update your settings',
                    description: e.response?.data?.message || 'There was an error updating your settings. Please try again later',
                    status: 'error'
                });
            }).finally(() => setIsLoading(false))
    }

    return(
        <ViewLayout pageTitle={'Settings'}>
            <div className="header mb-6">
                <h1 className="font-bold md:text-3xl">Settings</h1>
            </div>
            <Tabs colorScheme={"purple"} defaultIndex={defaultTabIndex}>
                <TabList>
                    <Tab><IoPersonOutline className="mr-2" /> Profile</Tab>
                    <Tab><FiSettings className="mr-2" /> Settings</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {
                            isPageLoading ?
                                <PageLoadingSchema /> :
                                <div className={`${styles.tab_body} ${styles.profile_tab}`}>
                                <div className="form pl-6 pr-8">
                                    <Formik
                                        initialValues={{
                                            name: authUser.name,
                                            email: authUser.email,
                                        }}
                                        onSubmit={saveUser}
                                    >
                                        {({ handleSubmit, errors, touched }) => (
                                            <form onSubmit={handleSubmit}>
                                                <FormControl mt="4" isInvalid={!!errors.name && !!touched.name}>
                                                    <FormLabel htmlFor="name">Name</FormLabel>
                                                    <Field
                                                        as={Input}
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        variant="filled"
                                                        validate={(value) => {
                                                            let error;
                                                            if (!value) {
                                                                error = 'Your name is required';
                                                            }
                                                            return error;
                                                        }}
                                                    />
                                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                                </FormControl>
                                                <FormControl mt="4">
                                                    <FormLabel htmlFor="email">Email</FormLabel>
                                                    <Field
                                                        as={Input}
                                                        disabled={true}
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        variant="filled"
                                                    />
                                                    <FormHelperText>Updating email is not supported at this time</FormHelperText>
                                                </FormControl>
                                                <div className="password mt-6">
                                                    <Button variant="ghost" colorScheme="purple" type="button">Reset Password</Button>
                                                </div>

                                                <div className="action mt-6">
                                                    <Button isLoading={isLoading} loadingText={'Saving..'} type="submit" colorScheme="purple">Save</Button>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                                <div className="photo"></div>
                            </div>
                        }

                    </TabPanel>
                    <TabPanel>
                        {
                            isPageLoading ?
                                <PageLoadingSchema/> :
                                <div className={`${styles.tab_body} ${styles.profile_tab}`}>
                                    <div className="form pl-6 pr-8">
                                        <FormControl mt="4">
                                            <FormLabel>Language</FormLabel>
                                            <Select

                                                value={{value: 'en', label: 'English'}}
                                                options={[{value: 'en', label: 'English'}]}
                                                placeholder={'Select your default language'}
                                            />
                                        </FormControl>

                                        <FormControl mt="4">
                                            <FormLabel>Country</FormLabel>
                                            <Select
                                                value={selectedCountryControl}
                                                options={getSelectOptions(countries, 'name', 'alpha2Code')}
                                                placeholder={'Select your country'}
                                                onChange={(val) => onCountrySelect(val)}
                                            />
                                        </FormControl>

                                        <FormControl mt="4">
                                            <FormLabel>Currency</FormLabel>
                                            <Select
                                                value={selectedCurrencyControl}
                                                options={getSelectOptions(currencies, 'name', 'code')}
                                                placeholder={'Select your currency'}
                                                onChange={(val) => onCurrencySelect(val)}
                                            />
                                            <FormHelperText>Select your base currency. Changing currency, the registered
                                                records will not be converted</FormHelperText>
                                        </FormControl>
                                        <div className="action mt-6">
                                            <Button
                                                isLoading={isLoading}
                                                loadingText={'Saving..'}
                                                colorScheme="purple"
                                                onClick={saveSettings}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="photo"></div>
                                </div>
                        }
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </ViewLayout>
    )
}

function PageLoadingSchema() {
    return (
        <div className={'pt-10'}>
            <div className="mb-6">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
            <div className="mb-6">
                <Skeleton height={'20px'} />
                <Skeleton mt='2' height={'50px'} />
            </div>
        </div>
    );
}