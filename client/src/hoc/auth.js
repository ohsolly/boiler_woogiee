import { Axios } from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null){

    // option null 아무나 출입가능한 페이지
    // option true 로그인 한 사람만 출입 가능한 페이지
    // option false 로그인 한 사람은 출입 안되는 페이지

    const dispatch = useDispatch()
    
    function AuthenticationCheck(props){

        useEffect(() => {
            
            dispatch(auth()).then(response =>{

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && response.payload.isAdmin){
                        props.history.push('/')
                    } else {
                        if(!option) {
                            props.history.push('/')
                        }
                    }
                }

            })
            
        }, [])

        return(<SpecificComponent />)
    }

    return AuthenticationCheck
} 