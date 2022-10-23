import Head from 'next/head';
import React from 'react';

function MetaTags({title}) {
    return(
        <Head>
            <title>{title} | Inpensar</title>
        </Head>
    );
}

export default MetaTags;