import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';
import host from '../config/host.json';
import axios from 'axios';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const VipDevelop = () => {
  const navigate = useNavigate();
  const checkAccountStatus = localStorage.getItem('key_account').toString();

  const DkVip = async () => {
    if(localStorage.getItem('token') && checkAccountStatus == '1'){
      try{
        const response = await axios.patch(`${SERVER_API}/vip`, null ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }, {
          withCredentials: true 
        });
        if (response.data.success) {
          console.log('Đã nâng cấp thành tài khoản VIP');
          window.location.reload();
        } else {
            toast.warning('Hãy tải lại trang', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            // console.log(response.headers)
            console.error('Không thể hoàn thành, có lỗi xảy ra');
        }
        localStorage.setItem('key_account' , '2')
      }
      catch (err) {
        console.log(err);
      }
    }
    else if(localStorage.getItem('token') && checkAccountStatus != '1'){
      toast.warning('Tài khoản này đang là tài khoản VIP, không thể đăng ký lại VIP');
    }
    else{
      navigate('/login');
    }
    
  }

  const HuyVip = async () => {
    if(localStorage.getItem('token') && checkAccountStatus == '2'){
      try{
        const response = await axios.patch(`${SERVER_API}/unvip`, null ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }, {
          withCredentials: true 
        });
        if (response.data.success) {
          console.log('Đã hạ cấp thành tài khoản thường');
          window.location.reload();
        }
        else {
            toast.warning('Hãy tải lại trang', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            console.error('Không thể hoàn thành, có lỗi xảy ra');
        }
        localStorage.setItem('key_account' , '1');
      }
      
      catch (err) {
        console.log(err);
      }
    }
    else if(localStorage.getItem('token') && checkAccountStatus != '2'){
      toast.warning('Tài khoản này đang là tài khoản thường, không thể hủy VIP');
    }
    else{
      navigate('/login');
    }
  }

  return (
    <>
      <button onClick={DkVip}>Dang ky Vip (patch: /vip)</button> 
      <button onClick={HuyVip}>Huy bo Vip (patch: /unvip)</button>
    </>
  )
}

export default VipDevelop