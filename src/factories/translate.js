import { TRANSLATIONS } from '../constants/translateLanguage';
export const trls = (translate_key) => {
    var lang = window.localStorage.getItem('eijf_lang');
    return(
        lang!=="undefined" ? TRANSLATIONS[lang][translate_key] : TRANSLATIONS["Dutch"][translate_key]
    )
};