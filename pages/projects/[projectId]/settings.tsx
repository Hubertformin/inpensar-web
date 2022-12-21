import {
    Button, FormControl, Skeleton, useToast,
} from "@chakra-ui/react";
import ProjectViewLayout from "../../../components/nav/ProjectViewLayout";
import React from "react";
import axios from "axios";
import useApi from "../../../hooks/useApi";
import {getSelectOption, getSelectOptions} from "../../../utils/array";
import Select from "react-select";
import {useDispatch, useSelector} from "react-redux";
import {selectAuthUserState, setUserSettings} from "../../../store/slices/auth.slice";

export default function SettingsHome() {
    const [countries, setCountries] = React.useState<any[]>([]);
    const [currencies, setCurrencies] = React.useState<any[]>([]);
    const [selectedCurrencyControl, setSelectedCurrencyControl] = React.useState<{ label: string, value: string }>();
    const [selectedCountryControl, setSelectedCountryControl] = React.useState<{ label: string, value: string }>();
    const [reportsFrequencyControl, setReportsFrequencyControl] = React.useState<{ label: string, value: string }>();
    const [isPageLoading, setIsPageLoading] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const api = useApi();
    const toast = useToast();
    const authState = useSelector(selectAuthUserState);

    const reportsFrequencyOptions = [
        { value: 'weekly', label: 'Weekly'},
        { value: 'monthly', label: 'Monthly'}
    ];

    const getCountriesAndCurrencies = async () => {
        const [countries, currencies] = await Promise.all([
            axios.get('https://restcountries.com/v2/all?fields=name,currencies,alpha2Code'),
            axios.get('https://openexchangerates.org/api/currencies.json'),
        ]);

        setCountries(countries.data);
        const _currencies = Object.keys(currencies.data).map(key => ({name: currencies.data[key], code: key}));
        setCurrencies(_currencies);

        const userCountry = countries.data.find(c => c.alpha2Code.toLowerCase() == authState.settings.country.toLowerCase());
        const userCurrency = _currencies.find(c => c.code == authState.settings.currency);

        setSelectedCountryControl(getSelectOption(userCountry, 'name', 'alpha2Code'));
        setSelectedCurrencyControl(getSelectOption(userCurrency, 'name', 'code'));

        setIsPageLoading(false);
    }

    React.useEffect(() => {
        if (authState._id && (countries.length == 0 || currencies.length == 0)) {
            getCountriesAndCurrencies();
        }
        setReportsFrequencyControl(reportsFrequencyOptions.find(r => r.value == authState.settings.reportsFrequency))
    }, [authState]);

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

    /**
     *
     * Save settings
     */
    const saveSettings = () => {
        // validate function
        const payload = {
            country: selectedCountryControl.value,
            language: authState.settings.language,
            currency: selectedCurrencyControl.value,
            reportsFrequency: reportsFrequencyControl.value
        };

        setIsLoading(true);

        api.updateUserSettings(authState._id, payload)
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

    return (
        <ProjectViewLayout title={'Settings'} showRightNav={false}>
            <main className="page-view px-4 md:px-8 py-6">
                <div className="toolbar mb-6 flex justify-between align-items-center">
                    <h1 className="font-bold text-2xl">Settings</h1>
                </div>
                {
                    isPageLoading ?
                        <PageLoadingSchema />
                        : (<div className="pt-8">
                            <div className="settings-item mb-6">
                                <h4 className="font-bold mb-1">Country</h4>
                                {/*<p className="text-slate-500 mb-3">*/}
                                {/*    Select your base currency. Changing currency, the registered records will not be converted*/}
                                {/*</p>*/}
                                <div className="w-72">
                                    <FormControl>
                                        <Select
                                            value={selectedCountryControl}
                                            options={getSelectOptions(countries, 'name', 'alpha2Code')}
                                            placeholder={'Select your country'}
                                            onChange={(val) => onCountrySelect(val)}
                                        />
                                    </FormControl>
                                </div>
                            </div>

                            <div className="settings-item mb-6">
                                <h4 className="font-bold mb-1">Language</h4>
                                {/*<p className="text-slate-500 mb-3">*/}
                                {/*    Select your base currency. Changing currency, the registered records will not be converted*/}
                                {/*</p>*/}
                                <div className="w-72">
                                    <FormControl>
                                        <Select
                                            value={{value: 'en', label: 'English'}}
                                            options={[{value: 'en', label: 'English'}]}
                                            placeholder={'Select your default language'}
                                        />
                                    </FormControl>
                                </div>
                            </div>


                            <div className="settings-item mb-6">
                                <h4 className="font-bold mb-1">Currency</h4>
                                <p className="text-slate-500 mb-3">
                                    Select your base currency. Changing currency, the registered records will not be converted
                                </p>
                                <div className="w-72">
                                    <FormControl>
                                        <Select
                                            value={selectedCurrencyControl}
                                            options={getSelectOptions(currencies, 'name', 'code')}
                                            placeholder={'Select your currency'}
                                            onChange={(val) => onCurrencySelect(val)}
                                        />
                                    </FormControl>
                                </div>
                            </div>

                            <div className="settings-item mb-6">
                                <h4 className="font-bold mb-1">Reports Frequency</h4>
                                <p className="text-slate-500 mb-3">
                                    When do you want Inpensar to send you reports email reports
                                </p>
                                <div className="w-72">
                                    <FormControl>
                                        <Select
                                            value={reportsFrequencyControl}
                                            options={reportsFrequencyOptions}
                                            onChange={setReportsFrequencyControl}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mt-6">
                                    <Button
                                        colorScheme="purple"
                                        isLoading={isLoading}
                                        onClick={saveSettings}
                                        loadingText={'Saving..'}
                                    >Save</Button>
                                </div>
                            </div>

                        </div>)
                }
            </main>
        </ProjectViewLayout>
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
