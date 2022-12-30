import React from "react";
import styles from "../../styles/LeftSideNav.module.scss";
import ActiveLink from "./ActiveLink";
import { TbLayoutDashboard, TbLayoutList } from "react-icons/tb";
import { IoWalletOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import {Avatar, AvatarBadge, Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {BiArrowBack, BiChevronUp } from "react-icons/bi";
import {useSelector} from "react-redux";
import {selectAuthUserState} from "../../store/slices/auth.slice";
import {selectActiveProjectState} from "../../store/slices/projects.slice";
import { AiOutlinePieChart } from "react-icons/ai";
import { formatDate } from "../../utils/date";
import {fireAuth} from "../../utils/firebase";
import {signOut} from "@firebase/auth";
import {useRouter} from "next/router";
import Link from "next/link";

export default function LeftSideNav({hideLinks= false}: {hideLinks?: boolean}) {
  const authUser = useSelector(selectAuthUserState);
  const activeProject = useSelector(selectActiveProjectState);
  const router = useRouter();

  const navigate = (url: string) => {
    router.push(url)
  }

  function logOut() {
    signOut(fireAuth).then(() => {
      router.push('/auth/login');
    });
  }
  
  return (
    <div className={`${styles.sideNavContainer} md:px-4`}>
      <h1 className={`${styles.brand} border-b pb-2`}>
        <img
          src="/images/logotype.png"
          style={{height: '50px'}}
          alt="logo"
        />
      </h1>
      <div className="mt-2">
        <Link href="/projects">
          <Button variant="ghost"><BiArrowBack />&nbsp;Back to Projects</Button>
        </Link>
      </div>
      <div className={styles.projectIntro}>
        <p className={styles.projectLabel}>PROJECT</p>
        <div className="project">
          <div className="leading flex align-items-center">
            <Avatar
              size="lg"
              name={activeProject?.name}
              bg="teal.500"
              color="white"
            />
            <div className="text ml-2">
              <h2 className={styles.projectTitle}>{activeProject?.name}</h2>
              <p className={styles.projectDescription}>Created {formatDate(activeProject?.createdAt, 'MMM D, YYYY')}</p>
            </div>
          </div>
        </div>
      </div>
      {!hideLinks && <nav className={styles.nav}>
        <>
          <ActiveLink href={`/projects/${activeProject?.id}/dashboard`} activeClassName={styles.activeLink}>
            <div className={styles.navTab}>
              <span className={styles.navTabIcon}>
                <TbLayoutDashboard size={24} />
              </span>
              <span className={styles.navTabText}>Dashboard</span>
            </div>
          </ActiveLink>
        </>
        <>
          <ActiveLink
            href={`/projects/${activeProject?.id}/transactions`}
            activeClassName={styles.activeLink}
          >
            <div className={styles.navTab}>
              <span className={styles.navTabIcon}>
                <TbLayoutList size={24} />
              </span>
              <span className={styles.navTabText}>Transactions</span>
            </div>
          </ActiveLink>
        </>
        <>
          <ActiveLink href={`/projects/${activeProject?.id}/accounts`} activeClassName={styles.activeLink}>
            <div className={styles.navTab}>
              <span className={styles.navTabIcon}>
                <IoWalletOutline size={24} />
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
                <AiOutlinePieChart size={24} />
              </span>
              <span className={styles.navTabText}>Budgets</span>
            </div>
          </ActiveLink>
        </>
        <>
          <ActiveLink href={`/projects/${activeProject?.id}/settings`} activeClassName={styles.activeLink}>
            <div className={styles.navTab}>
              <span className={styles.navTabIcon}>
                <FiSettings size={24} />
              </span>
              <span className={styles.navTabText}>Settings</span>
            </div>
          </ActiveLink>
        </>
      </nav>}
      <div className={styles.navFooter}>
        <div className="leading flex">
          <Avatar
            size="md"
            name={authUser?.name}
            bg="orange.500"
            color="white"
            src={
              "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat2&accessoriesType=Wayfarers&hatColor=Blue01&hairColor=Blue&facialHairType=BeardMajestic&facialHairColor=Platinum&clotheType=BlazerShirt&clotheColor=PastelRed&eyeType=Hearts&eyebrowType=SadConcernedNatural&mouthType=Sad&skinColor=Black"
            }
          >
            <AvatarBadge boxSize='1.25em' bg='green.500' />
          </Avatar>
          <div className="text ml-2">
            <h2 className={styles.projectFooterTitle}>{authUser?.name}</h2>
            <p className={styles.projectDescription}>{authUser?.email}</p>
          </div>
        </div>
        <div className="actions">
          <Menu>
            <MenuButton className={styles.pageFooterIconButton}>
              <BiChevronUp size={24} style={{ margin: "auto" }} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/settings?t=profile')}>Profile</MenuItem>
              {/*<MenuItem>Create new project</MenuItem>*/}
              <MenuItem onClick={() => navigate('/settings?t=settings')}>Settings</MenuItem>
              <MenuItem onClick={logOut}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
}
