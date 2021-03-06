import React, {useState, useEffect} from 'react'
import {apiUrl} from '../services/api.jsx'
import axios from 'axios';
import UserForm from '../components/UserForm.jsx';
import Cookies from 'universal-cookie';
import {useHistory} from 'react-router-dom';

const cookie = new Cookies();

const Login = () => {
    //functions-------------------
    useEffect(() => {
        if(cookie.get('token')){
            history.push('/menu')
        }
        
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const signUp = async() =>{
        try{
            const response = await axios({
                url: `${apiUrl}/users/login`,
                method: 'POST',
                data: user
            })
            if(response.data.errorMsg){
                setError({
                    error: true,
                    errorMsg: response.data.errorMsg,
                });
                
            }
            else{
                setError({
                    error: false,
                    errorMsg: ""
                });
                console.log(response.data);
                cookie.set('email', response.data.correo, {path: '/'});
                cookie.set('id', response.data.id, {path: '/'});
                cookie.set('token', response.data.token, {path: '/'});
                window.location.href="/menu";
            }
        }
        catch(e){
            setError({
                error: true,
                errorMsg: e.message
            })
        }
    }

    //handles----------------
    const handleChange = async(e) =>{
        e.preventDefault();
        await setUser({
            ...user,
            [e.target.name] : e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        signUp();      
    }




    //states--------------------------------
    const [user, setUser] = useState({
        correo: "",
        password: ""
    });
    const [error, setError] = useState({
        error: false,
        errorMsg: ""
    })
    const history = useHistory();
    
    


    return (
        <UserForm
            error={error} 
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            messageButton={`Sing Up`}
        />
    )
}

export default Login



