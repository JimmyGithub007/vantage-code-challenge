
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
  const [ loading, setLoading ] = useState(true);

  const columns = [
    { id: 'name', name: 'Name', search: true },
    { id: 'type', name: 'Type', search: true },
    { id: 'unit', name: 'Unit', search: true },
    { id: 'value', name: 'value', search: false }
  ];

  const getAPI = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL);
      setRates(response.data.rates);
    } catch (error) {
      setIsError(true);
      console.log('fetch data failed', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }

  useEffect(() => {
    getAPI();
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
