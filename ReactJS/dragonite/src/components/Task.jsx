import React, { Component, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';
import { toast } from 'react-toastify';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const Task = () => {
    const [data, setData] = useState('');
    const [countSent, setCountSent] = useState('');
    const [serviceName, setServiceName] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();
    let stt = 1;
    const assistId = localStorage.getItem('assist_id');

    const [sendData, setSendData] = useState({
        email: '',
        deadline: ''
    });

    useEffect(() => {
        // const validToken = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                // xử lý e-mail để lấy tên dịch vụ smtp
                const getUserEmail = localStorage.getItem('email');
                const parts = getUserEmail.split('@');
                const domainParts = parts[1].split('.');

                // fetch api
                const response = await axios.get(`${SERVER_API}${API_ENDPOINT}/Mail`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                
                setData(response.data.data);
                setCountSent(response.data);
                setServiceName(domainParts[0]);

                //console.log("Check count sent mail: " + countSent.the_number_of_mail_sent)              
        }
        catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [auth.token]);    
    
  

    const removeMailFromStack = async (mailId) => {
        try {
            // await axios.get(`${SERVER_API}/sanctum/csrf-cookie`, { withCredentials: true });
            const response = await axios.patch(`${SERVER_API}${API_ENDPOINT}/Mail/${mailId}`, 
                null, {
                headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    'Content-Type': 'application/json',
                    'Charset':'utf-8',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.data.success) {
                console.log('Đã đánh dấu hoàn thành');
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
        } catch (error) {
            console.error('Có lỗi xảy ra. Nội dung lỗi: ', error);
        }
    };

    const sendMailFunction = async (e) => { // sendAll MAils
        e.preventDefault();
        try {
            const email = localStorage.getItem('email');
            const smtp = localStorage.getItem('SMTP_password');
         
            const sendData = {
                email: email,
                smtp: smtp 
            };
            const response = await axios.post(`${SERVER_API}${API_ENDPOINT}/Mail/send`, 
                sendData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                },
                {withCredentials: true}
            );
           

            if (response.data.success) {
                console.log('Dang gui tin hieu toi SMTP...'); 
            } else {             
                console.error('Co loi xay ra');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        e.target.innerHTML = '<p style="cursor:not-allowed">Đang gửi e-mail</p>';
    };
   
    return (
      <div className='container'>
        <h4>Danh sách e-mail (E-mail Stack)</h4>
        <div className='mb-4 text-danger'>
            <i>Các e-mail phía dưới đang được chờ để gửi đi. Hãy kiểm tra thật cẩn thận trước khi nhấn nút <strong>Gửi toàn bộ</strong>, vì không thể hoàn tác sau khi thực hiện nhấn nút.</i>
        </div>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu đề thư</th>
                    <th scope="col">Nội dung thư</th>
                    <th scope="col">Đính kèm tệp</th>
                    <th scope="col">Gửi đến địa chỉ</th>
                    <th scope="col">Gỡ khỏi stack</th>
                </tr>
            </thead>
            <tbody>
                {(data.length === 0) ? (
                    <tr>
                        <td colSpan="7" className="text-center">Không có thư khả dụng</td>
                    </tr>
                ) : (
                        data.map((mails) => (
                            (
                                <tr key={mails.id}>
                                    <td>{stt++}</td>
                                    <td>{mails.mailSubject}</td>
                                    <td>{mails.mailContent}</td>
                                    <td>{mails.attachment == null && <p>Không có</p>}
                                        {mails.attachment != '' && mails.attachment}</td>
                                    <td>{mails.toAddress}</td>
                                    <td>
                                        <button className='btn btn-danger' onClick={ () => removeMailFromStack(mails.id)}>X</button>
                                    </td>
                                </tr>
                            )
                        )
                    ))}
            </tbody>
        </table>
        <div>
            {(countSent.the_number_of_mail_sent > 0) ? (
                <p>Trong lịch sử, bạn có <Link to="/history" className="no-underline-link"> {countSent.the_number_of_mail_sent} thư đã gửi</Link>, hãy kiểm tra chúng trong hộp thư đã gửi (<a href={`http://${serviceName}.com`} target='_blank'>{serviceName}</a>).</p>
            ) : (
                <p>Lịch sử hệ thống sẽ ghi nhận thư sau khi bạn sử dụng ứng dụng. Dịch vụ đang được sử dụng: <a href={`http://${serviceName}.com`} target='_blank'>{serviceName}</a></p>
            )}
        </div>
        <div className='text-center mt-4 mb-4'>
            {(data.length > 0) ? (
                <button className='btn btn-primary' onClick={sendMailFunction}>Gửi toàn bộ thư ở trên</button>
            ) : (
                ''
            )}
        </div>
        
      </div>
    )
  }


export default Task;