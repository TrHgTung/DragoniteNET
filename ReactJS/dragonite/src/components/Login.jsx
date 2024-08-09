import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import { useAuth } from '../supports/AuthProvider';
import { toast } from 'react-toastify';
import host from '../config/host.json';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;
axios.defaults.withCredentials = true;

const Login = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleLogin  = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(`${SERVER_API}/login`, {
                Email,
                Password,
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }, { withCredentials: true });

            const { token } = response.data;
           
            if (token) {
                login(token); 
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                toast.success('Đăng nhập thành công!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                localStorage.setItem('email', Email);
                localStorage.setItem('user_id', response.data.user.userId);
                localStorage.setItem('SMTP_password', response.data.user.smtpPassword);
                localStorage.setItem('key_account', response.data.status);
                navigate('/');
            } else {
                console.log('Không khởi tạo được token');
                toast.error('Không khởi tạo được token.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            
        }
        catch (error) {
            toast.error('Sai thông tin đăng nhập.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log(error);
        }
    };
  
    return (
        
        <div className='container'>
            <div className='mt-4'>
                <Link to="/welcome" className='no-underline-link'>&lt; Quay lại Trang chủ</Link>
            </div>
            <form onSubmit={handleLogin} autoComplete='off'>
                <div className="row">
                    <div className="col-md-6">
                        <img src="/bg/0.png" alt="review-pokemon" />
                    </div>
                    <div className="col-md-6">
                    <h2 className='w-100 d-flex justify-content-center p-3'>Yêu cầu xác thực người dùng</h2>
                        <div className="form-floating text-center">
                            <i>Bạn phải đăng nhập để có thể xem được nội dung của mình</i>
                        </div>
                        <div className="form-floating mt-4">
                            <label htmlFor='email'>E-mail đăng nhập:</label>
                            <input type="email" className="form-control" id="email" value={Email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-floating mt-4 mb-4">   
                            <label htmlFor='password'>Mật khẩu:</label>
                            <input type="password" className="form-control" id="password" value={Password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary w-100 py-2" type="submit">Đăng nhập</button>
                        {error && <p>{error}</p>}
                        <div className='mt-3'>
                            <p>Bạn chưa có tài khoản? Hãy bắt đầu <Link to="/register">đăng ký sử dụng</Link> ứng dụng</p>
                        </div>
                    </div>
                    
                </div>
                <p><strong>Hình ảnh</strong>: <i>The Pokémon Company / Game Freak / Nintendo (1996) &copy; Pokémon</i></p>
                <p><strong>Mã nguồn</strong>: <i>Hoàng Tùng</i></p>
            </form>
        </div>
    )
  }


export default Login;