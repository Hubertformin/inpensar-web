import React from "react";
import LeftSideNav from "./LeftSideNav";
import RightSideNav from "./RightSideNav";
import styles from '../../styles/PageLayout.module.scss';

export default function ProjectViewLayout({children}) {
    return (
        <div className={styles.__page_home}>
            <div className={styles.leftSideNav}>
                <LeftSideNav />
            </div>
            <div className={styles.pageContainer}>{children}</div>
            <div className={styles.rightSideNav}>
                <RightSideNav />
            </div>
        </div>
    )
}