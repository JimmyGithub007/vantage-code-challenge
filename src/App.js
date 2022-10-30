
import axios from 'axios';
import { useEffect, useState } from 'react';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import ErrorPage from './components/pages/ErrorPage';
import ColumnChart from './components/share/ColumnChart';
import DataGrid from './components/share/DataGrid';
import Loader from './components/share/Loader';
import './styles/Style.scss';
import _ from 'lodash';

const App = () => {
  const [ rates, setRates ] = useState([]);
  const [ isError, setIsError ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const columns = [
    { id: 'name', name: 'Name' },
    { id: 'type', name: 'Type' },
    { id: 'unit', name: 'Unit' },
    { id: 'value', name: 'value' }
  ];

  useEffect(() => {
    setLoading(true);
    setIsError(false);
    axios.get(process.env.REACT_APP_API_URL)
    .then(response => {
      setRates(response.data.rates);
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    }).catch(error => {
      setLoading(false);
      setIsError(true);
      console.log('fetch data failed', error);
    })
  }, []);

  return (<>
    <Header />
    <div className='content'>
      {
        loading ? <Loader /> :
        isError ? <ErrorPage /> :
          <>
            <ColumnChart data={_.values(rates)} />
            <div className='card'>
              <DataGrid columns={columns} rates={rates} />
            </div>
          </>
      }
    </div>
    <Footer />
  </>);
}

export default App;
