
import {NextSeo} from "next-seo";

const INPENSAR_COVER = 'https://firebasestorage.googleapis.com/v0/b/inpensar-enchird.appspot.com/o/page_cover.png?alt=media&token=156bc642-27f5-44d6-964d-f7e6dbf7559c';

function SeoTags({title, description = "", imageUrl = INPENSAR_COVER}) {
    return(
        <NextSeo
            title={`${title} - INPENSARZ`}
            description={description}
            canonical="https://www.canonical.ie/"
            openGraph={{
                url: 'https://www.inpensar.vercel.app',
                title,
                description,
                images: [
                    {
                        url: imageUrl,
                        width: 800,
                        height: 600,
                        alt: 'inpensar',
                    }
                ],
            }}
        />
    )
}

export default SeoTags;
