import React from 'react';
import styles from '../../styles/BottomBar.module.scss';
import {TbLayoutDashboard, TbLayoutList} from "react-icons/tb";
import {BsCreditCard2Back, BsPiggyBank} from "react-icons/bs";
import {FiSettings} from "react-icons/fi";
import ActiveLink from "./ActiveLink";
import {useRouter} from "next/router";

export default function BottomNav() {
    const router = useRouter();
    return (
        <nav className={styles.navBar}>
            <>
                <ActiveLink href="/app/dashboard" activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                        <span className={styles.navTabIcon}>
                        <TbLayoutDashboard size={24}/>
                    </span>
                        <span className={styles.navTabText}>Dashboard</span>
                    </div>

                </ActiveLink>
            </>
            <>
                <ActiveLink href="/app/transactions" activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <TbLayoutList size={24}/>
                    </span>
                        <span className={styles.navTabText}>Transactions</span>
                    </div>
                </ActiveLink>

            </>
            <>
                <ActiveLink href="/app/accounts" activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <BsCreditCard2Back size={24}/>
                    </span>
                        <span className={styles.navTabText}>Accounts</span>
                    </div>
                </ActiveLink>
            </>
            {/*<div className={styles.navTab}>*/}
            {/*    <span className={styles.navTabIcon}>*/}
            {/*        <TbLayoutDashboard size={24} />*/}
            {/*    </span>*/}
            {/*    <span className={styles.navTabText}>Reports</span>*/}
            {/*</div>*/}
            <>
                <ActiveLink href="/app/budget" activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <BsPiggyBank size={24}/>
                    </span>
                        <span className={styles.navTabText}>Budget</span>
                    </div>
                </ActiveLink>
            </>
            <>
                <ActiveLink href="/app/settings" activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <FiSettings size={24}/>
                    </span>
                        <span className={styles.navTabText}>Settings</span>
                    </div>
                </ActiveLink>
            </>
        </nav>
    );
}