import { useEffect, useRef, useState } from "react";
import { FaSortDown } from "react-icons/fa";

const DropDown = (props) => {
    const [ show, setShow ] = useState(false);
    const dropDownRef = useRef();

    const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setShow(false);
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return (<div className={`dropdown ${props.className}`} ref={dropDownRef}>
        <span onClick={() => setShow(!show) }>{props.title} <FaSortDown /></span>
        <div className={`dropdown-content ${show && 'show'}`}>
            {props.children}
        </div>
    </div>);
}

export default DropDown;