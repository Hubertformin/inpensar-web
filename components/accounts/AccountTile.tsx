import {AccountsModel} from "../../models/accounts.model";
import {Avatar} from "@chakra-ui/react";
import {IoWalletOutline} from "react-icons/io5";
import {getAccountTypeName} from "../../utils/account";
import {formatCurrency} from "../../utils/number";
import React from "react";

declare type AccountTileSize = 'sm' | 'md' | 'lg';

export default function AccountTile({account, size = 'md', onClick}: {account: AccountsModel, size?: AccountTileSize, onClick?: () => void}) {
    return (
        <div onClick={() => onClick ? onClick() : null} className={`flex cursor-pointer items-center ${size == 'sm' ? 'mb-3' : 'mb-6'} border-b pb-4 justify-between`}>
            <div className="leading flex gap-2">
                <Avatar size={size} icon={<IoWalletOutline size={size == 'sm' ? 16 : 24}/>} />
                <div>
                    <h2 className={`font-medium w-32 truncate ${size == 'sm' ? '' : 'text-lg'}`}>{account.name}</h2>
                    <p className={`text-slate-500 ${size == 'sm' ? 'text-sm' : ''}`}>{getAccountTypeName(account.type)}</p>
                </div>
            </div>
            <div className="actions">
                <p className={`font-medium ${size == 'sm' ? 'text-sm' : 'text-xl'}`}>{formatCurrency(account.amount)}</p>
            </div>
        </div>
    )
}
