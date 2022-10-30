import { AiOutlineGithub } from 'react-icons/ai';
import '../../styles/Style.scss';

const Header = () => {
    return (<div className='header'>
        RATES LIST
        <a href={process.env.REACT_APP_GITHUB_URL}>Github <AiOutlineGithub /></a>
    </div>);
}

export default Header;