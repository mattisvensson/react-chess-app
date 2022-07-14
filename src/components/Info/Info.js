import React, {useState} from 'react';
import './Info.css'

function Info () {

    const [collapsed, setCollapsed] = useState(true)

    function handleClick () {
        setCollapsed(!collapsed)
    }

    function hideInfo () {
        return (
            <>
                <svg height="48" width="48">
                    <path d="M24.2 35q.65 0 1.125-.475t.475-1.175q0-.65-.475-1.125T24.2 31.75q-.65 0-1.125.475T22.6 33.35q0 .7.475 1.175Q23.55 35 24.2 35Zm-1.4-6.9h2.3q0-1.2.375-2.2.375-1 1.875-2.25 1.45-1.3 2.1-2.475.65-1.175.65-2.575 0-2.5-1.625-4.025Q26.85 13.05 24.3 13.05q-2.25 0-3.95 1.15-1.7 1.15-2.5 3l2.05.8q.6-1.35 1.65-2.1 1.05-.75 2.6-.75 1.8 0 2.85 1t1.05 2.5q0 1.05-.625 1.975T25.65 22.55q-1.45 1.3-2.15 2.575-.7 1.275-.7 2.975ZM24 43q-3.9 0-7.375-1.5t-6.05-4.075Q8 34.85 6.5 31.375 5 27.9 5 24q0-3.95 1.5-7.425Q8 13.1 10.575 10.55 13.15 8 16.625 6.5 20.1 5 24 5q3.95 0 7.425 1.5Q34.9 8 37.45 10.55 40 13.1 41.5 16.575 43 20.05 43 24q0 3.9-1.5 7.375t-4.05 6.05Q34.9 40 31.425 41.5 27.95 43 24 43Zm0-2.25q7 0 11.875-4.9T40.75 24q0-7-4.875-11.875T24 7.25q-6.95 0-11.85 4.875Q7.25 17 7.25 24q0 6.95 4.9 11.85 4.9 4.9 11.85 4.9ZM24 24Z"/>
                </svg>
            </>
        )
    }

    function showInfo () {
        return (
            <div>
                <h3>Chess App</h3>
                <h5>Version 2.0</h5>
                <p>If you find a bug or if i messed something up, please let me know via <a href="mailto:matti@mattisvensson.com">email</a> or on any of my linked profiles.</p>
                <a href="https://github.com/mattisvensson/react-chess-app" target="_blank">View project on GitHub</a>
            </div>
        )
    }

    return ( 
        <div id="Info" className={`${collapsed === true ? "collapsed" : "visible"}`} onClick={handleClick}>
            {collapsed ? hideInfo() : showInfo()}
        </div>
     );
}

export default Info;