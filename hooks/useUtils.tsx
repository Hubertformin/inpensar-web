import {useSelector} from "react-redux";
import {selectAuthUserState} from "../store/slices/auth.slice";
import React from "react";
import currencyFormatter from 'currency-formatter';

interface Currency {
    code: string,
    symbol: string,
    thousandsSeparator: string,
    decimalSeparator: string,
    symbolOnLeft: boolean,
    spaceBetweenAmountAndSymbol: boolean,
    decimalDigits: number
}

function useUtils() {
    const authState = useSelector(selectAuthUserState);

    React.useEffect(() => {
        // console.log(authState)
    }, [authState])

    function formatCurrency(amount: number) {
        let value = amount || 0;
        // const formatter = new Intl.NumberFormat(authState.settings.language || 'en-CM', {
        //     style: 'currency',
        //     currency: authState.settings.currency || 'XAF'
        // });
        //
        // return formatter.format(value);
        return currencyFormatter.format(value, {locale: 'en-US', code: authState.settings.currency || 'XAF'})
    }

    function formatShortCurrency(val: number, options?: {decimalPlaces: number}) {
        // format values to two dec
        const fractionDigits = typeof options?.decimalPlaces == 'number' ? options.decimalPlaces : 2;

        if (val >= Math.pow(10, 9)) {
            return `${getCurrency().symbol}${(val / Math.pow(10, 9)).toFixed(fractionDigits)}B`;
        }
        if (val >= Math.pow(10, 6)) {
            return `${getCurrency().symbol}${(val / Math.pow(10, 6)).toFixed(fractionDigits)}M`;
        }
        if (val >= Math.pow(10, 3)) {
            return `${getCurrency().symbol}${(val / Math.pow(10, 3)).toFixed(fractionDigits)}K`;
        }
        // if value is less than 1000
        return getCurrency().symbol + val;
    }

    function formatShortNumber(val: number) {
        // format values to two dec
        if (val >= Math.pow(10, 9)) {
            return `${(val / Math.pow(10, 9)).toFixed(1)}B`;
        }
        if (val >= Math.pow(10, 6)) {
            return `${(val / Math.pow(10, 6)).toFixed(1)}M`;
        }
        if (val >= Math.pow(10, 3)) {
            return `${(val / Math.pow(10, 3)).toFixed(1)}K`;
        }
        // if value is less than 1000
        return val;
    }

    function getCurrency(): Currency {
        return currencyFormatter.findCurrency(authState.settings.currency || 'XAF');
    }

    return {
        formatCurrency,
        getCurrency,
        formatShortCurrency,
        formatShortNumber
    }
}

export default useUtils;