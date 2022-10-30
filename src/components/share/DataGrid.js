import { useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { BiSortAZ, BiSortAlt2, BiSortZA } from 'react-icons/bi'
import { FaSortDown } from 'react-icons/fa'
import _ from 'lodash';
import '../../styles/Style.scss';

const DataGrid = (props) => {
    const sortListing = [ 'asc', 'desc' ];
    const rowsPerPages = [ 5, 10, 20, 30, 50 ];

    const [ mobile, setMobile ] = useState(false);
    const [ pageNum, setPageNum ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(5);
    const [ order, setOrder ] = useState({ direction: null, id: null });
    const [ checkedAll, setCheckedAll ] = useState(false);
    const [ checkedState, setCheckedState] = useState(
        new Array(_.size(props.rates)).fill(false)
    );

    const handleSort = (orderId) => {
        let direction = 'asc';
        if(order.id === orderId) {
            if(order.direction === 'asc') {
                direction = 'desc'
            } else if(order.direction === 'desc') {
                direction = null;
            }
        }
        setOrder({ direction, id: direction ? orderId : null });
    }

    const disableBtn = (type) => {
        if(type === 1) {
            if(pageNum === 0) return true;
        } else if(type === 2) {
            if(pageNum * rowsPerPage + rowsPerPage >= _.size(props.rates)) return true;
        }
        return false;
    }

    const handleWindowResize = () => {
        if (window.innerWidth < 576) { setMobile(true); }
        else { setMobile(false); }
    }

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedAll(!_.includes(updatedCheckedState, false));
        setCheckedState(updatedCheckedState);
    }

    useEffect(() => {
        handleWindowResize();
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return (<div>
        <div className='tbl-title'>
            <h3>Rates</h3>
            <div className='dropdown'>
                <span>sort by { !order.id ? 'default' : order.id+' '+order.direction} {order.id && ( order.direction === 'asc' ? <BiSortAZ /> : <BiSortZA /> ) }<FaSortDown /></span>
                <div className='dropdown-content'>
                    <ul>
                        <li className={`${order.id === null && order.direction === null && 'active'}`} onClick={() => setOrder({ id: null, direction: null }) }>sort by default</li>
                        {
                            props.columns.map((col, k1) => (
                                sortListing.map((sort, k2) => (
                                    <li className={`${col.id === order.id && sort === order.direction && 'active'}`} onClick={() => setOrder({ id: col.id, direction: sort }) } key={k1+k2}>
                                        sort by {col.id} {sort} {sort === 'asc' ? <BiSortAZ /> : <BiSortZA /> }
                                    </li>
                                )) 
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
        <table className='tbl'>
            <thead>
                <tr>
                    <th><input type='checkbox' checked={checkedAll} onChange={() => { setCheckedAll(!checkedAll); setCheckedState(new Array(_.size(props.rates)).fill(!checkedAll)) } } /></th>
                    {
                        props.columns.map((col, key) => (
                            ((mobile && key < 1) || !mobile) &&
                            <th className='sort-th' key={key} onClick={() => { !mobile && handleSort(col.id) } }>
                                <span>{col.name}
                                    {   !mobile && ( order.id === col.id && order.direction ?
                                            (order.direction === 'asc' ? <BiSortAZ /> : <BiSortZA />) : <BiSortAlt2 />
                                        )
                                    }
                                </span>
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
            {
                _.orderBy(props.rates, [order.id], [order.direction])
                .slice(pageNum * rowsPerPage, pageNum * rowsPerPage + rowsPerPage)
                .map((rate, k1) => {
                    const k = k1+(pageNum * rowsPerPage);
                    return <tr key={k}>
                        <td>
                            <input type='checkbox' 
                                checked={checkedState[k]}
                                onChange={() => handleOnChange(k)} 
                            />
                        </td>
                        {
                            props.columns.map((col, k2) => (
                                ((mobile && k2 < 1) || !mobile) &&
                                <td className={`${order.id === col.id && order.direction && 'sort-td'}`} key={k2}>
                                    {_.get(rate, col.id)}
                                    {mobile && <ul>
                                        {
                                            props.columns.filter((c, k3) => k3 > 0).map((col2, k4) => (
                                                <li key={k4}><b>{col2.name} : </b>{_.get(rate, col2.id)}</li>
                                            ))
                                        }
                                    </ul>
                                    }
                                </td>
                            ))
                        }
                    </tr>
                })
            }
            </tbody>
        </table>
        <div className='pagination'>
            <span>Rows per page:</span>
            <div className='dropdown'>
                <span>{rowsPerPage} <FaSortDown /></span>
                <div className='dropdown-content'>
                    <ul>
                        {
                            rowsPerPages.map((p, key) => (
                                rowsPerPage !== p && <li key={key} onClick={() => { setPageNum(0); setRowsPerPage(p); } }>{p} / page</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <span>{(pageNum * rowsPerPage)+1}-{ disableBtn(2) ? _.size(props.rates) : pageNum * rowsPerPage + rowsPerPage } of {_.size(props.rates)}</span>
            <AiOutlineLeft className={`${disableBtn(1) && 'disabled'}`} onClick={() => { if(!disableBtn(1)) { let num = pageNum; setPageNum(num-1) }} } />
            <AiOutlineRight className={`${disableBtn(2) && 'disabled'}`} onClick={() => { if(!disableBtn(2)) { let num = pageNum; setPageNum(num+1) }} } />
        </div>
    </div>)
}

export default DataGrid;