import styles from '../styles/Home.module.scss'
import BottomNav from "../components/nav/BottomBar";
import Link from "next/link";
import {Button} from "@chakra-ui/react";

export default function Home() {
  return (
    <div className="page-container">

      <main className="page-view px-8 py-16">
          <h1 className="text-4xl font-bold mb-6 text-center">Welcome to inpensar</h1>
          <div className="flex justify-center">
              <Link href={'/app/dashboard'}>
                  <Button>Continue to app</Button>
              </Link>
          </div>
      </main>
    </div>
  )
}
