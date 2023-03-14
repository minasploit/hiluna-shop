import dynamic from "next/dynamic";
import { useState } from "react";
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ReactQuillComp = () => {
    const [convertedText, setConvertedText] = useState("Some default content");
    
    return <>
        <ReactQuill
            theme='snow'
            value={convertedText}
            onChange={setConvertedText}
            style={{ minHeight: '300px' }}
        />
        {convertedText}
    </>
}

export default ReactQuillComp