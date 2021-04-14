import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export const parseStringToHtml = (html) => {
    console.log("STRING PA", ReactHtmlParser(html), html);
    return ReactHtmlParser(html);
}