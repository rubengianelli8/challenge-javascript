import React, {useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {apiUrl} from '../services/api.jsx';
import FormTransaction from '../components/FormTransaction.jsx';
import ShowTransactions from '../components/ShowTransactions.jsx';
import styles from '../styles/Menu.module.css';
import {useHistory} from 'react-router-dom';
import {notificationError} from '../services/notification.jsx'

const cookie = new Cookies();

const Menu = () => {
    const history = useHistory();
    //states
    const [data, setData] = useState([])
    const [active, setActive] = useState(false); //active for modal FormTransaction
    const [type, setType] = useState("");
    const [typeTransaction, setTypeTransaction] = useState({
        type: "limited"
    })
    const [balance, setBalance] = useState(0);

    //functions
    const toggle = () => {
        setActive(!active);
    }
    const handleChangeFilter = (e) =>{
        e.preventDefault();
        setTypeTransaction({
            [e.target.name] : e.target.value
        })
    }
                                //set balance 
    const ApiBalance = () => {
        axios.get(`${apiUrl}/transactions/all/${cookie.get('id')}`)
            .then(response => {return response.data})
            .then(data => {
                let egress = 0;
                let ingress = 0;
                data.forEach(transact => {
                    if(transact.tipo === "egress"){
                        egress = egress + transact.monto
                    }else{
                        ingress = ingress + transact.monto
                    }
                })
                let total = ingress - egress;
                setBalance(total);
                
            })
    }
    const callApi = async (path) =>{
        try{
            const response = await axios({
                url: `${apiUrl}${path}`,
                method: 'GET',
            })
            setData(response.data); 
        }
        catch(e){
            notificationError(e.message);
        }
    }
    //hooks
    useEffect(()=>{
        if(cookie.get('token')){
            ApiBalance();
            if(typeTransaction.type === "all"){
                callApi(`/transactions/all/${cookie.get('id')}`)
            }else if(typeTransaction.type === "egress"){
                callApi(`/transactions/egress/${cookie.get('id')}`)
            }else if(typeTransaction.type === "ingress"){
                callApi(`/transactions/ingress/${cookie.get('id')}`)
            }else{
                callApi(`/transactions/limited/${cookie.get('id')}`)
            }
           

        }else{
            history.push("/home");
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[data.lenght])
    
    return (
        <div className={`${styles.menu}`}>
            <FormTransaction 
                toggle={toggle}
                active={active}
                call={callApi}
            />
            <div className={`${styles.controls}`}>

                <h2 className={styles.balance}>Balance: ${balance}</h2>

                <div className={`${styles.controlsChild} my-3`}>
                    <button className="btn btn-primary" onClick={() => 
                        {
                            toggle();
                            setType(type=> "post")
                        }
                    }>Add Transaction</button>
                </div>

                <div className={`${styles.controlsChild}`}>
                    <select className="me-2" name="type" value={typeTransaction.type} onChange={handleChangeFilter}>
                        <option value="limited">Limited</option>
                        <option value="all">All</option>
                        <option value="egress">Egress</option>
                        <option value="ingress">Ingress</option>
                    </select>
                    
                    <button className="btn btn-primary" onClick={
                        () => {
                            callApi(`/transactions/${typeTransaction.type}/${cookie.get('id')}`)
                            
                        }
                    }>Apply filters</button>
                </div>
            </div>
          
            <ShowTransactions data={data} toggle={toggle} setType={setType} type={type}/>
            
        </div>
    )
}

export default Menu
