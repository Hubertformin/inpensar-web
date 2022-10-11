import React from "react";
import styles from '../styles/LeftSideNav.module.scss';
import ActiveLink from "./ActiveLink";
import {TbLayoutDashboard, TbLayoutList} from "react-icons/tb";
import {IoWalletOutline} from "react-icons/io5";
import {BsPiggyBank} from "react-icons/bs";
import {FiSettings} from "react-icons/fi";
import {Avatar, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {BiChevronUp} from "react-icons/bi";
import Image from "next/image";

export default function LeftSideNav() {
    return (
        <div className={styles.sideNavContainer}>
            <h1 className={styles.brand}>
                <Image src="/images/Logo.png" width={200} height={50} layout="responsive" alt="logo"/>
            </h1>
            <div className={styles.projectIntro}>
                <p className={styles.projectLabel}>PROJECT</p>
                <div className="project">
                    <div className="leading flex align-items-center">
                        <Avatar size="lg" name="Personal Finance" bg="teal.500" color="white" />
                        <div className="text ml-2">
                            <h2 className={styles.projectTitle}>Personal Finance</h2>
                            <p className={styles.projectDescription}>Created on 15/04/2022</p>
                        </div>
                    </div>
                </div>
            </div>
            <nav className={styles.nav}>
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
            <div className={styles.navFooter}>
                <div className="leading flex">
                    <Avatar
                        size="md"
                        name="Hubert Formin"
                        bg="orange.500" color="white"
                        src={'https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Wayfarers&hatColor=Blue01&hairColor=Blue&facialHairType=BeardMajestic&facialHairColor=Platinum&clotheType=BlazerShirt&clotheColor=PastelRed&eyeType=Hearts&eyebrowType=SadConcernedNatural&mouthType=Sad&skinColor=Black'}
                    />
                    <div className="text ml-2">
                        <h2 className={styles.projectFooterTitle}>Huber Formin</h2>
                        <p className={styles.projectDescription}>hformin@gmail.com</p>
                    </div>
                </div>
                <div className="actions">
                    <Menu>
                        <MenuButton className={styles.pageFooterIconButton}>
                            <BiChevronUp size={24} style={{margin: 'auto'}} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>Profile</MenuItem>
                            {/*<MenuItem>Create new project</MenuItem>*/}
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </div>
        </div>
    )
}