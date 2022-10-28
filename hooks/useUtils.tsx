import {useSelector} from "react-redux";
import {selectAuthUserState} from "../store/slices/auth.slice";
import React from "react";
import currencyFormatter from 'currency-formatter';

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
        return currencyFormatter.format(value, { locale: 'en-US', code: authState.settings.currency || 'XAF' })
    }

    return {
        formatCurrency
    }
}

export default useUtils;