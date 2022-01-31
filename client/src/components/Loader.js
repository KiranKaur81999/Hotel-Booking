import React, { useState } from 'react'
import HashLoader from "react-spinners/HashLoader";

function Loader() {
    const [loading, setLoading] = useState(true);
    return (
        <div style={{marginTop : '150px'}}>
            <div className="sweet-loading text-center">
                <HashLoader color='#000' loading={loading} size={80} />
            </div>
        </div>
    )
}

export default Loader
