import React, { Component, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';
import pokemon_color from '../config/pokemon-color.json';

const {SERVER_API} = host;
const {API_ENDPOINT} = host;

const {Venusaur} = pokemon_color;
const {Pikachu} = pokemon_color;
const {Charizard} = pokemon_color;
const {Umbreon} = pokemon_color;
const {Lapras} = pokemon_color;
const {Dragonite} = pokemon_color;
const {Blastoise} = pokemon_color;
const {Dragapult} = pokemon_color;
const {Clefable} = pokemon_color;
const {Lucario} = pokemon_color;

const Task = () => {
    const [data, setData] = useState('');
    const [serviceName, setServiceName] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();
    let stt = 1;
    // const pokemonName = localStorage.getItem('pokemon_name');
    const assistId = localStorage.getItem('assist_id');

    const [sendData, setSendData] = useState({
        email: '',
        //assistant: '',
        deadline: ''
    });

    useEffect(() => {
        // const validToken = localStorage.getItem("token");
        const fetchData = async () => {
            try {
                const getUserEmail = localStorage.getItem('email');
                // xử lý e-mail để lấy tên dịch vụ smtp
                const parts = getUserEmail.split('@');
                const domainParts = parts[1].split('.');

                //fetch api
                const response = await axios.get(`${SERVER_API}${API_ENDPOINT}/Mail`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                
                setServiceName(domainParts[0]);
                setData(response.data.all_mails_sent);
        }
        catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const value = localStorage.getItem('assistant');
        if (value) {
          switch (parseInt(value, 10)) {
            case 1:
              document.body.style.backgroundColor = Venusaur;
              break;
            case 2:
              document.body.style.backgroundColor = Pikachu;
              break;
            case 3:
              document.body.style.backgroundColor = Charizard;
              break;
            case 4:
              document.body.style.backgroundColor = Umbreon;
              break;
            case 5:
              document.body.style.backgroundColor = Lapras;
              break;
            case 6:
              document.body.style.backgroundColor = Dragonite;
              break;
            case 7:
              document.body.style.backgroundColor = Blastoise;
              break;
            case 8:
              document.body.style.backgroundColor = Dragapult;
              break;
            case 9:
              document.body.style.backgroundColor = Clefable;
              break;
            default:
              document.body.style.backgroundColor = Lucario;
          }
        }
    }, [auth.token]);    

    
    if (data === null || !data) {
        return (
        <div className='container mt-4'>
           <div className='mb-4'>
                <Link to="/" className='no-underline-link'>&lt; Quay lại danh sách chính</Link>
            </div>
            <div className='text-center'>
                <h5>Lịch sử e-mail đã hoàn tất:  </h5>
                <div className='mb-4'>
                    <i>Dưới đây là tất cả thư mà bạn đã gửi đi thành công, hãy xem lại chúng. Bạn cũng có thể kiểm tra trong hộp thư gửi đi ({serviceName})</i>
                </div>
            </div>
           <div className='mt-4 mb-4'>
                <p> Máy chủ hiện tại không phản hồi...</p>
           </div>
        </div>
        );
    }

  
   
    return (
      <div className='container mt-4'>
        <div className='mb-4'>
                <Link to="/" className='no-underline-link'>&lt; Quay lại danh sách chính</Link>
            </div>
            <div className='text-center'>
                <h5>Lịch sử e-mail đã hoàn tất:  </h5>
                <div className='mb-4'>
                    <i>Dưới đây là tất cả thư mà bạn đã gửi đi thành công, hãy xem lại chúng. Bạn cũng có thể kiểm tra trong hộp thư gửi đi ({serviceName})</i>
                </div>
            </div>
           
        
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT | Mail ID</th>
                    <th scope="col">Tiêu đề thư</th>
                    <th scope="col">Nội dung thư</th>
                    <th scope="col">Đính kèm tệp</th>
                    <th scope="col">Đã gửi đến địa chỉ</th>
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
                                    <td>{stt++} | {mails.mailId}</td>
                                    <td>{mails.mailSubject}</td>
                                    <td>{mails.mailContent}</td>
                                    <td>{mails.attachment == null && <p>Không có</p>}
                                        {mails.attachment != '' && mails.attachment}</td>
                                    <td>{mails.toAddress}</td>
                                </tr>
                            )
                        )
                    ))}
            </tbody>
        </table>
      </div>
    )
  }


export default Task;