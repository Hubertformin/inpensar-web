
import Link from "next/link";
import {Button, ButtonGroup, Spinner} from "@chakra-ui/react";
import styles from '../styles/Home.module.scss';
import {AiOutlineArrowRight} from "react-icons/ai";
import React from "react";
import {fireAuth} from "../utils/firebase";
import {useRouter} from "next/router";
import SeoTags from "../components/Utility/SeoTags";

declare type AUTH_STATE = 'NOT_INITIALIZED' | 'AUTHENTICATED' | 'UN_AUTHENTICATED';

export default function Home() {
    const router = useRouter();

    React.useEffect(() => {
        fireAuth.onAuthStateChanged( (user) => {
            if (user) {
                router.push('/projects');
            } else {
                // User is signed out redirect to log in
                router.push('/auth/create-account');
            }
        });
    }, []);

    return (
        <div className={styles.splash_bg}>
            <img src="/logo_square.png" alt="" className={`${styles.splash_logo} mb-6`} />
            <Spinner size="md" />
        </div>
    )

  // return (
  //   <>
  //       <SeoTags
  //           title="Welcome to Inpensar"
  //           description="Inpensar is an app allows you to monitor and categorize your expenses across different wallets/accounts with budgeting tools."
  //       />
  //       <div className={styles.page_container}>
  //
  //           <main className="h-full px-8 md:px-64 pt-16 md:pt-64">
  //               <div className={styles.view}>
  //                   <div className="content">
  //                       <img src="/images/logotype.png" className={`${styles.logo} mx-auto md:mx-0`} />
  //                       <h1 className={`${styles.text_color} text-3xl mt-3 md:text-5xl text-white mb-6 font-bold`}>Welcome to inpensar</h1>
  //                       <p className={`${styles.text_color} text-lg md:text-xl`}>
  //                           Inpensar is an app that allows you to monitor and categorize your expenses
  //                           across different wallets/accounts with budgeting tools.
  //                       </p>
  //                       <div className="mt-6">
  //                           {authState === 'AUTHENTICATED' && <Link href={'/projects'}>
  //                               <Button colorScheme="brand">Continue to app&nbsp;<AiOutlineArrowRight /></Button>
  //                           </Link>}
  //                           {authState === 'UN_AUTHENTICATED' && <ButtonGroup gap={2}>
  //                               <Link href={'/auth/create-account'}>
  //                                   <Button colorScheme="brand">Create Account</Button>
  //                               </Link>
  //                               <Link href={'/auth/login'}>
  //                                   <Button variant="outline" colorScheme="brand">Log In</Button>
  //                               </Link>
  //                           </ButtonGroup>}
  //                       </div>
  //                   </div>
  //                   <div className={"mt-16 md:mt-0"}>
  //                       <img src="/images/Inro_mockup.png" className="w-full" alt=""/>
  //                   </div>
  //               </div>
  //           </main>
  //       </div>
  //   </>
  // )
}
