import Image from "next/image";
import React from "react";
import {Progress, Spinner} from "@chakra-ui/react";

export default function PageLoader() {
    return (
        <div style={{ background: "#FFF8E2" }} className={'absolute top-0 bottom-0 left-0 right-0 bg-white flex justify-center items-center flex-col'}>
            <img
                src="/logo_square.png"
                className={'h-20 md:h-32'}
                alt="logo"
            />
            <div className="progress flex justify-center h-10 sm:mx-6 mt-6 w-64">
                <Spinner size="md" colorScheme={'brand'} />
            </div>
        </div>
    )
}
