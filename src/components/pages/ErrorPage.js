import { FaSadTear } from 'react-icons/fa';
import '../../styles/Style.scss';

const ErrorPage = () => {
    return (<div className='error'>
        <FaSadTear />
        <h2>SORRY,</h2>
        <span>Seen like something went wrong with the API call.</span>
    </div>)
}

export default ErrorPage;