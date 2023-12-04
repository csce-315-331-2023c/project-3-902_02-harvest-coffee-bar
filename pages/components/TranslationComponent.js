import { useEffect, useState } from "react";
import { getCookie, hasCookie } from 'cookies-next';

export default function TranslationComponent() {

    const [selected, setSelected] = useState(null)

    useEffect(() => {
        var addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;

        if (hasCookie('googtrans')) {
            setSelected(getCookie('googtrans'))
        }
        else {
            setSelected('/auto/en')
        }
    }, [])


    const googleTranslateElementInit = () => {

        new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: 'false',
            layout: google.translate.TranslateElement.InlineLayout.VERTICAL
        },
            'google_translate_element');
    }

    return (
        <>
            <div id="google_translate_element"></div>
        </>

    )
}