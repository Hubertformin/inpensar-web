import MetaTags from "./MetaTags";
import React from "react";
import styles from "../../styles/ViewLayout.module.scss"
import ActiveLink from "./ActiveLink";
import {AiOutlineProject} from "react-icons/ai";
import {
    Avatar,
    Drawer, DrawerBody, DrawerCloseButton,
    DrawerContent, DrawerHeader,
    DrawerOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, useDisclosure
} from "@chakra-ui/react";
import {BiChevronDown} from "react-icons/bi";
import {FiSettings} from "react-icons/fi";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {AuthState, selectAuthState, selectAuthUserState} from "../../store/slices/auth.slice";
import PageLoader from "./PageLoader";
import {HiMenuAlt2} from "react-icons/hi";
import useWindowSize from "../../hooks/useWindowSize";
import {signOut} from "@firebase/auth";
import {fireAuth} from "../../utils/firebase";
import Link from "next/link";

export default function ViewLayout({pageTitle, children}) {
    const router = useRouter();
    const authState = useSelector(selectAuthState);
    const authUser = useSelector(selectAuthUserState);
    const drawerDisclosure = useDisclosure();
    const size = useWindowSize();

    React.useEffect(() => {
        if (authState == AuthState.UNAUTHENTICATED) {
            router.push('/auth/login');
        }
    }, [authState, router]);

    const navigate = (url: string) => {
        router.push(url)
    }

    function logOut() {
        signOut(fireAuth).then(() => {
            router.push('/auth/login');
        });
    }

    return (
        authState == 'AUTHENTICATED' ? <>
            <MetaTags title={pageTitle}/>
            <nav id="toolbar" className={`${styles.toolbar} flex justify-between items-center`}>
                <div className="pl-3 flex items-center">
                    <button onClick={drawerDisclosure.onOpen} className="inline md:hidden">
                        <HiMenuAlt2 fontSize={26} color="#683ab7" />
                    </button>
                    <Link href={'/'}>
                        <img
                            className={styles.toolbarImg}
                            src="/images/logotype.png"
                            alt="logo"
                        />
                    </Link>
                </div>
                {/*<div className="w-1/2">*/}
                {/*    <Input placeholder={'Search..'} />*/}
                {/*</div>*/}
                <div className="Actions px-6">
                    <Menu>
                        <MenuButton>
                            <div className="flex items-center gap-2.5">
                                <Avatar size="sm" bg="red" color="white" name={authUser.name} />
                                <p className="font-semibold hidden md:block">{authUser.name}</p>
                                <BiChevronDown />
                            </div>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => navigate('/settings?t=profile')}>Profile</MenuItem>
                            <MenuItem onClick={logOut}>Log out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </nav>
            <nav id="side_nav" className={`${styles.sideNav} px-4 pt-6 bg-gray-900`}>
                <div className={`${styles.sideHeader}`}>
                    <img
                        src="/images/logotype.png"
                        style={{height: '60px'}}
                        alt="logo"
                    />
                </div>
                <ActiveLink href={'/projects'} activeClassName={styles.activeLink}>
                    <div className={styles.navTab}>
                        <span className={styles.navTabIcon}>
                          <AiOutlineProject size={24}/>
                        </span>
                        <span className={styles.navTabText}>Projects</span>
                    </div>
                </ActiveLink>
                <div className={`${styles.bottomLInks} px-4`}>
                    <ActiveLink href={'/settings'} activeClassName={styles.activeLink}>
                        <div className={styles.navTab}>
                        <span className={styles.navTabIcon}>
                          <FiSettings size={24}/>
                        </span>
                            <span className={styles.navTabText}>Settings</span>
                        </div>
                    </ActiveLink>
                </div>
            </nav>
            {/*---- FOR SMALL SCREENS --------*/}
            {size?.width <= 768 && <Drawer
                placement={'left'}
                onClose={drawerDisclosure.onClose}
                isOpen={drawerDisclosure.isOpen}
                size={'xs'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <img
                            src="/images/logotype.png"
                            style={{height: '50px'}}
                            alt="logo"
                        />
                    </DrawerHeader>
                    <DrawerBody>
                        <ActiveLink href={'/projects'} activeClassName={styles.activeLink}>
                            <div className={styles.navTab}>
                        <span className={styles.navTabIcon}>
                          <AiOutlineProject size={24}/>
                        </span>
                                <span className={styles.navTabText}>Projects</span>
                            </div>
                        </ActiveLink>
                        <div className={`${styles.bottomLInks} px-4`}>
                            <ActiveLink href={'/settings'} activeClassName={styles.activeLink}>
                                <div className={styles.navTab}>
                        <span className={styles.navTabIcon}>
                          <FiSettings size={24}/>
                        </span>
                                    <span className={styles.navTabText}>Settings</span>
                                </div>
                            </ActiveLink>
                        </div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>}
            {/*---- // FOR SMALL SCREENS --------*/}
            <div className={`${styles.viewBody} px-6 py-6`}>{children}</div>
        </>  : <PageLoader/>
    );
}