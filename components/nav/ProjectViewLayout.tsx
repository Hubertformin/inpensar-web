import React from "react";
import LeftSideNav from "./LeftSideNav";
import RightSideNav from "./RightSideNav";
import styles from '../../styles/PageLayout.module.scss';
import PageLoader from "./PageLoader";
import {useSelector} from "react-redux";
import {AuthState, selectAuthState} from "../../store/slices/auth.slice";
import {useRouter} from "next/router";
import MetaTags from "./MetaTags";
import useWindowSize from "../../hooks/useWindowSize";
import {HiMenuAlt2} from "react-icons/hi";
import BottomNav from "./BottomBar";
import {FaCoins} from "react-icons/fa";
import {Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure} from "@chakra-ui/react";
import Link from "next/link";

export default function ProjectViewLayout({title = 'Project', showRightNav = true, children}) {
    const router = useRouter();
    const authState = useSelector(selectAuthState);
    const size = useWindowSize();


    React.useEffect(() => {
        if (authState == AuthState.UNAUTHENTICATED) {
            router.push('/auth/login');
        }
    }, [authState, router]);
    return (
        <>
            <MetaTags title={title}/>
            {authState == 'AUTHENTICATED' ? <Layout screenSize={size}
                                                    showRightNav={showRightNav}>{children}</Layout> : <PageLoader/>}
        </>
    )
}

function Layout({screenSize, showRightNav, children}) {
    const PHONE_SIZE_LIMIT = 768;
    if (screenSize.width < PHONE_SIZE_LIMIT) {
        return <SMLayout>{children}</SMLayout>
    } else {
        return <MDLayout showRightNav={showRightNav}>{children}</MDLayout>
    }
}

function MDLayout({showRightNav, children}) {
    return (
        <div className={`${styles.__page_home} ${!showRightNav ? styles.__page_home_no_right : ''}`}>
            <div className={styles.leftSideNav}>
                <LeftSideNav/>
            </div>
            <div className={styles.pageContainer}>{children}</div>
            {showRightNav && <div className={styles.rightSideNav}>
                <RightSideNav/>
            </div>}
        </div>)
}

function SMLayout({children}) {
    const rightDisclosure = useDisclosure();
    const leftDisclosure = useDisclosure();

    return (
        <div className={`${styles.__page_home_sm}`}>
            <div className={`${styles.toolbar_sm} px-4`}>
                <button onClick={leftDisclosure.onOpen} className="inline">
                    <HiMenuAlt2 fontSize={26} color="#fff"/>
                </button>
                <Link href={'/projects'}>
                    <img
                        src="/images/sunshine_logo_white.png"
                        style={{height: '36px'}}
                        alt="logo"
                    />
                </Link>
                <button onClick={rightDisclosure.onOpen} className="inline">
                    <FaCoins fontSize={22} color="#fff"/>
                </button>
            </div>
            {/*<LeftSideNav/>*/}
            <div className={styles.page_container_sm}>{children}</div>
            {/*<RightSideNav/>*/}
            <div className={styles.bottom_navigation_sm}>
                <BottomNav/>
            </div>
            {/*  Left Drawer  */}
            <Drawer placement={'bottom'} orientation={'vertical'} onClose={leftDisclosure.onClose} isOpen={leftDisclosure.isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    {/*<DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>*/}
                    <DrawerBody>
                        <LeftSideNav hideLinks={true}/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            {/*  Right Drawer  */}
            <Drawer placement={'right'} onClose={rightDisclosure.onClose} isOpen={rightDisclosure.isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    {/*<DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>*/}
                    <DrawerBody>
                        <RightSideNav/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>)
}
