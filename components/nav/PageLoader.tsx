import Image from "next/image";
import React from "react";
import {Progress} from "@chakra-ui/react";

export default function PageLoader() {
    return (
        <div className={'absolute top-0 bottom-0 left-0 right-0 bg-white flex justify-center items-center flex-col'}>
            <img
                src="/images/logotype.png"
                className={'h-20 md:h-32'}
                alt="logo"
            />
            <div className="progress h-10 sm:mx-6 mt-6 w-64">
                <Progress size='xs' isIndeterminate colorScheme={'purple'} />
            </div>
        </div>
    )
}