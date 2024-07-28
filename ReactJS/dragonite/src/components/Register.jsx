import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import host from '../config/host.json';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const Register = () => {
    const [formData, setFormData] = useState({
        DisplayName: '',
        Email: '',
        Password: '', 
        confirm_password: '', 
        SMTPPassword: '', // for send mail
    });
    const [selectOption, setSelectOption] = useState('0');
    const navigate = useNavigate();

    const handleChange = (e) => {
        // setSelectOption(e.target.value);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            // [e.target.name]: e.target.value
            [name]: value
        });
    };

    const handleRegister = async (e) => { // kiem tra xac nhan password
        e.preventDefault();
        if(formData.Password != formData.confirm_password){
            toast.error('Mật khẩu nhập lại không chính xác');
            return;
        }

        if (!formData.DisplayName || !formData.Email || !formData.Password || !formData.SMTPPassword) {
            toast.error('Vui lòng điền đầy đủ các thông tin.');
            return;
        }

        console.log('Data being sent:', formData.Password);

        try{
            //await axios.get('http://127.0.0.1:4401/sanctum/csrf-cookie', { withCredentials: true });
            const response = await axios.post(`${SERVER_API}/register`, {
                DisplayName: formData.DisplayName,
                Email: formData.Email,
                Password: formData.Password,
                SMTPPassword: formData.SMTPPassword,
            },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            ,  { withCredentials: true });

            if(response.data.success){
                toast.success('Đăng ký thành công. Hãy đăng nhập bằng tài khoản của bạn');
            }
            else{
                toast.warning('Đăng ký thành công. Hãy đăng nhập bằng tài khoản của bạn');
                // toast.error('Có lỗi xảy ra (else). Hãy thử lại');
            }
        }
        catch (error){
            toast.error('Có lỗi xảy ra (catch execption). Hãy thử lại');
        }
    };

    // const [selectOption, setSelectOption] = useState('0');
    // const handleSelectOptionChange = (e) => {
    //     setSelectOption(e.target.value);
    // }

  return (
    <div className="container">
        <div className='mt-4'>
            <Link to="/login" className='no-underline-link'>&lt; Quay lại Đăng nhập</Link>
        </div>
            <form onSubmit={handleRegister}>
                <div className="row">
                    <div className="col-md-6 mt-5">
                        <img src="/bg/0.png"  alt=''/>
                    </div>
                    <div className="col-md-6">
                        <h2 className='w-100 d-flex justify-content-center p-3 mt-3'>Đăng ký sử dụng</h2>
                        <p className='text-center'><i>Một lần đăng ký cho tất cả các phiên đăng nhập</i></p>
                        <div className="form-floating mt-4">
                            <label htmlFor='DisplayName'>Tên hiển thị:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="DisplayName" 
                                name="DisplayName" 
                                value={formData.DisplayName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-floating mt-4">
                            <label htmlFor='Email'>E-mail:</label>
                            <input 
                                type="Email" 
                                className="form-control" 
                                id="Email" 
                                name="Email" 
                                value={formData.Email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-floating mt-4">
                            <label htmlFor='Password'>Mật khẩu:</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="Password" 
                                name="Password" 
                                value={formData.Password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-floating mt-4 mb-4">
                            <label htmlFor='confirm_password'>Nhập lại mật khẩu:</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="confirm_password" 
                                name="confirm_password" 
                                value={formData.confirm_password} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-floating mt-4 mb-4">
                            <label htmlFor='SMTPPassword'>Nhập mật khẩu SMTP*:</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="SMTPPassword" 
                                name="SMTPPassword" 
                                value={formData.SMTPPassword} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <button className="btn btn-primary w-100 py-2" type="submit">Đăng ký</button>
                        <div className='row mt-3'>
                            <div className="col-6 col-md-6"></div>
                            <div className='col-6 col-md-6'>
                                <p>Đã có tài khoản? <Link to="/login">Quay về đăng nhập</Link></p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className='p-0.25'>*: Truy cập <Link to="https://myaccount.google.com/apppasswords">https://myaccount.google.com/apppasswords</Link> và làm theo hướng dẫn của <i>Google </i>để lấy mật khẩu ứng dụng (cho mục đích gửi e-mail bằng phương thức SMTP)</p>
                        
                        <p><b>Tác quyền & Hình ảnh: </b> <i> The Pokémon Company, GameFreak, Nintendo</i></p>
                        <p><strong>Mã nguồn</strong>: <i>Hoàng Tùng</i></p>
                    </div>
                </div>
            </form>
        </div>
  )
}

export default Register