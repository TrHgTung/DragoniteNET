import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';
import host from '../config/host.json';
import axios from 'axios';
import Footer from './Footer';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const VipUpgrade = () => {
  const navigate = useNavigate();
  let checkAccountStatus = '';
  if(localStorage.getItem('key_account') != null){
    checkAccountStatus = localStorage.getItem('key_account').toString();
  }
  const [data, setData] = useState('');

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
        localStorage.clear();
        navigate('/login');
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

  const DeleteAccount = async () => {
    if(window.confirm('Nếu đồng ý, bạn sẽ không thể truy cập lại dữ liệu của mình. Vẫn tiếp tục?') == true){
      // patch: /deleteaccount
      try{
        const response = await axios.patch(`${SERVER_API}/deleteaccount`, null ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }, {
          withCredentials: true 
        });
        if (response.data.success) {
          localStorage.clear();
          window.alert('Đã xóa tài khoản thành công, tạm biệt bạn');
          console.log('Đã xóa tài khoản');
          navigate('/login');
          
          // window.location.reload();
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
            localStorage.clear();
            window.alert('Đã xóa tài khoản thành công, tạm biệt bạn');
            console.log('Đã xóa tài khoản');
            navigate('/login');
           // console.error('Không thể hoàn thành, có lỗi xảy ra');
        }
      }
      catch(e){
        console.log(e);
      }
      // return ;
    }
      
    
    else{
      return;
    }
  }
  

  return (
    <div className='container'>
      <div className="row mt-4">
        <div className="col-2 col-md-2 mb-4 mt-2">
          <div className='text-center force-link' >
            <Link to='/' className='no-underline-link'>&lt; Quay lại trang dữ liệu</Link>
          </div>
        </div>
        <div className="col-7">
        </div>
        <div  className="col-3">
          <button className='btn btn-sm btn-warning' onClick={DeleteAccount}>Gỡ bỏ tài khoản</button>
        </div>
       
      </div>
      <div className="row">
        <div className="col-12 text-center">
          <h2>Thiết lập VIP</h2>
          <p><i>Thiết lập mở rộng trải nghiệm sử dụng cho tài khoản của bạn</i></p>
          <div className='mt-5'>
            {(checkAccountStatus == '1') ? (
              <>
                <div className='mb-1'>
                  <button onClick={DkVip} className='btn btn-warning'>Thiết lập VIP</button> 
                </div>
                <div className='mt-2'>
                  <small><i>Cho phép tối đa thêm vào 12 nội dung thư mỗi phút</i></small> <br />
                  <small><i>Tải lên tệp có kích cỡ đến 20MB</i></small>
                </div>
              </>              
            ) : (
              <>
                <div  className='mb-1'>
                  <button onClick={HuyVip} className='btn btn-danger'>Hủy bỏ VIP (yêu cầu đăng nhập lại)</button>
                </div>
                <div  className='mt-2'>
                  <small><i>Giới hạn lại tối đa 3 nội dung thư mỗi phút</i></small> <br />
                  <small><i>Cho phép tải lên tệp chỉ tối đa 10MB</i></small>
                </div>
              </>
            )}      
          </div>
        </div>      
      </div>
      <div>
       {(checkAccountStatus == '1') ? (
          <img src='/bg/Dragonite1.png' alt="Register VIP" />
       ) : (
          <img src='/bg/Dragonite2.png' alt="Register VIP" />
       )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default VipUpgrade