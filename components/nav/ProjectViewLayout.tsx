import React from "react";
import LeftSideNav from "./LeftSideNav";
import RightSideNav from "./RightSideNav";
import styles from '../../styles/PageLayout.module.scss';
import PageLoader from "./PageLoader";
import {useSelector} from "react-redux";
import {AuthState, selectAuthState} from "../../store/slices/auth.slice";
import {useRouter} from "next/router";

export default function ProjectViewLayout({children}) {
    const router = useRouter();
    const authState = useSelector(selectAuthState);

    React.useEffect(() => {
        (authState);
        if (authState == AuthState.UNAUTHENTICATED) {
            router.push('/auth/login');
        }
    }, [authState])
    return (
        authState == 'AUTHENTICATED' ? (<div className={styles.__page_home}>
            <div className={styles.leftSideNav}>
                <LeftSideNav />
            </div>
            <div className={styles.pageContainer}>{children}</div>
            <div className={styles.rightSideNav}>
                <RightSideNav />
            </div>
        </div>) : <PageLoader />
    )
}