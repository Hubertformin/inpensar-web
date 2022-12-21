import React from 'react';
import styles from '../../styles/BottomBar.module.scss';
import {TbLayoutDashboard, TbLayoutList} from "react-icons/tb";
import {BsPiggyBank} from "react-icons/bs";
import {FiSettings} from "react-icons/fi";
import ActiveLink from "./ActiveLink";
import {IoWalletOutline} from "react-icons/io5";
import {useSelector} from "react-redux";
import {selectActiveProjectState} from "../../store/slices/projects.slice";

export default function BottomNav() {
    const activeProject = useSelector(selectActiveProjectState);

    return (
        <nav className={styles.navBar}>
            <>
                <ActiveLink href={`/projects/${activeProject?.id}/dashboard`} activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                        <span className={styles.navTabIcon}>
                        <TbLayoutDashboard size={24}/>
                    </span>
                        <span className={styles.navTabText}>Dashboard</span>
                    </div>

                </ActiveLink>
            </>
            <>
                <ActiveLink href={`/projects/${activeProject?.id}/transactions`} activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <TbLayoutList size={24}/>
                    </span>
                        <span className={styles.navTabText}>Transactions</span>
                    </div>
                </ActiveLink>

            </>
            <>
                <ActiveLink href={`/projects/${activeProject?.id}/accounts`} activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <IoWalletOutline size={24}/>
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
                <ActiveLink href={`/projects/${activeProject?.id}/budgets`} activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                    <span className={styles.navTabIcon}>
                        <BsPiggyBank size={24}/>
                    </span>
                        <span className={styles.navTabText}>Budget</span>
                    </div>
                </ActiveLink>
            </>
            <>
                <ActiveLink href={`/projects/${activeProject?.id}/settings`} activeClassName={styles.activeLink}>
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