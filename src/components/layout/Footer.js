import { SiLodash, SiNetlify, SiSass } from 'react-icons/si'
import { GrReactjs } from 'react-icons/gr'
import '../../styles/Style.scss';

const Footer = () => {
    return (<div className='footer'>
        Designed & Built by by Jimmy Hoe
        <div className='icons'>
            <GrReactjs />
            <SiSass />
            <SiLodash />    
            <SiNetlify />        
        </div>
        Hosting by Netlify
    </div>);
}

export default Footer;