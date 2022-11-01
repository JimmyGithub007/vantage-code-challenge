import { useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight, AiOutlineSearch } from 'react-icons/ai'
import { BiSortAZ, BiSortAlt2, BiSortZA } from 'react-icons/bi'
import _ from 'lodash';
import '../../styles/Style.scss';
import DropDown from './DropDown';

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
    const [ search, setSearch] = useState(
        props.columns.filter(c => c.search === true).map(column => {
            return { id: column.id, keyword: '' }
        })
    );

    const totalSearch = () => {
        let total = 0;
        search.forEach((s, k) => {
            if(s.keyword.length > 0) {
                total += 1;
            }
        })
        return total;
    }

    const handleSearch = (id, keyword) => {
        setPageNum(0);
        setSearch(prev => {
            return prev.map(item => {
                return item.id === id ? { ...item, keyword: keyword } : item
            })
        })
        handleSetCheck(false, new Array(_.size(props.rates)).fill(false));
    }

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

    const handleFilter = () => {
        return _.filter(props.rates, (v) => {
            let show = true;
            search.forEach((s, k) => {
                if(!v[s.id].toLowerCase().includes(String(s.keyword).toLowerCase())) {
                    show = false;
                }
            })
            return show;
        })
    }

    const disableBtn = (type) => {
        if(type === 1) {
            if(pageNum === 0) return true;
        } else if(type === 2) {
            if(pageNum * rowsPerPage + rowsPerPage >= _.size(handleFilter())) return true;
        }
        return false;
    }

    const handleWindowResize = () => {
        if (window.innerWidth < 576) { setMobile(true); }
        else { setMobile(false); }
    }

    const handleSetCheck = (all, each) => {
        setCheckedAll(all); 
        setCheckedState(each);
    }

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        handleSetCheck(!_.includes(updatedCheckedState, false), updatedCheckedState);
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
            <div className='tbl-filter'>
                <DropDown className='mobile-view' title={<>sort by {!order.id ? 'default' : order.id + ' ' + order.direction} {order.id && (order.direction === 'asc' ? <BiSortAZ /> : <BiSortZA />)}</>}>
                    <ul>
                        <li className={`${order.id === null && order.direction === null && 'active'}`} onClick={() => setOrder({ id: null, direction: null })}>sort by default</li>
                        {
                            props.columns.map((col, k1) => (
                                sortListing.map((sort, k2) => (
                                    <li className={`${col.id === order.id && sort === order.direction && 'active'}`} onClick={() => setOrder({ id: col.id, direction: sort })} key={k1 + k2}>
                                        sort by {col.id} {sort} {sort === 'asc' ? <BiSortAZ /> : <BiSortZA />}
                                    </li>
                                ))
                            ))
                        }
                    </ul>
                </DropDown>
                <DropDown className='search' title={<span><AiOutlineSearch />{ totalSearch() > 0 && <span className='badge'>{ totalSearch() }</span> }</span>}>
                    <ul>
                        {
                            props.columns.map((col, key) => (
                                col.search && <li key={key}>
                                    <input className='input-text' onChange={(e) => handleSearch(col.id, e.target.value)} placeholder={col.id.toUpperCase()+' KEYWORD'} />
                                </li>
                            ))
                        }
                    </ul>
                </DropDown>
            </div>
        </div>
        <table className='tbl'>
            <thead>
                <tr>
                    <th><input type='checkbox' checked={checkedAll} onChange={() => handleSetCheck(!checkedAll, new Array(_.size(handleFilter())).fill(!checkedAll)) } /></th>
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
            {   _.size(handleFilter()) > 0 ?
                _.orderBy(handleFilter(), [order.id], [order.direction])
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
                }) : <tr><td className='no-data' colSpan={props.columns.length+1}>No data found</td></tr>
            }
            </tbody>
        </table>
        <div className='pagination'>
            <span>Rows per page:</span>
            <DropDown title={rowsPerPage}>
                <ul>
                    {
                        rowsPerPages.map((p, key) => (
                            rowsPerPage !== p && <li key={key} onClick={() => { setPageNum(0); setRowsPerPage(p); }}>{p} / page</li>
                        ))
                    }
                </ul>
            </DropDown>
            <span>{(pageNum * rowsPerPage)+(_.size(handleFilter()) > 0 && 1)}-{ disableBtn(2) ? _.size(handleFilter()) : pageNum * rowsPerPage + rowsPerPage } of {_.size(handleFilter())}</span>
            <AiOutlineLeft className={`btn ${disableBtn(1) && 'disabled'}`} onClick={() => { if(!disableBtn(1)) { let num = pageNum; setPageNum(num-1) }} } />
            <AiOutlineRight className={`btn ${disableBtn(2) && 'disabled'}`} onClick={() => { if(!disableBtn(2)) { let num = pageNum; setPageNum(num+1) }} } />
        </div>
    </div>)
}

export default DataGrid;