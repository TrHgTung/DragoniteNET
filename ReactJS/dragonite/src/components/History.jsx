import React, { Component, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';
import pokemon_color from '../config/pokemon-color.json';
import { toast } from 'react-toastify';
import Footer from './Footer';

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
    const [dataItem, setDataItem] = useState('');
    const [PageIndex, setPageIndex] = useState('');
    const [ItemNumber, setNumberofItem] = useState('');
    const [newData, setNewData] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();
    let stt = 1;
    // const pokemonName = localStorage.getItem('pokemon_name');
    const assistId = localStorage.getItem('assist_id');

    const [sendData, setSendData] = useState({
        email: '',
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
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setDataItem(Math.floor(response.data.the_number_of_mail_sent / 5));
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

    const handlePagination = async (item) => {
      try{
        const takeData = await axios.get(`${SERVER_API}${API_ENDPOINT}/Mail`,{
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type' : 'application/json'
          }
        });
        setNumberofItem(takeData.data.the_number_of_mail_sent);
        setPageIndex(item);
      }
      catch (error) {
        console.log(error);
        return;
      }
      
      try{
        const response = await axios.post(`${SERVER_API}${API_ENDPOINT}/Mail/pagination`, {
          ItemNumber,
          PageIndex: item
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }, {
          withCredentials: true 
        });

        // setDataItem(Math.floor(response.data.the_number_of_mail_sent / 5));
        setNewData(response.data.sent_mails_by_pageIndex);

        // test
        console.log('ItemNumber = ' + ItemNumber);
        console.log('PageIndex = ' + item); 
        console.log('Data item = ' + dataItem);  // failed
      }
      catch (err) {
        console.log(err);
      }
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
                    <th scope="col">STT</th>
                    <th scope="col">Mail ID</th>
                    <th scope="col">Tiêu đề thư</th>
                    <th scope="col">Nội dung thư</th>
                    <th scope="col">Đính kèm tệp</th>
                    <th scope="col">Đã gửi đến địa chỉ</th>
                </tr>
            </thead>
            <tbody>
                {(data.length !== 0 && newData.length === 0) ? ( // mac dinh (vua tai trang)
                    data.map((mails) => (
                      (<>
                          <tr key={mails.id}>
                              <td>{stt++}</td>
                              <td>{mails.mailId}</td>
                              <td>{mails.mailSubject.substring(0, 100)} ...</td>
                              <td>{mails.mailContent.substring(0, 150)} ...</td>
                              <td>{mails.attachment == null && <p>Không có</p>}
                                  {mails.attachment != '' && mails.attachment}</td>
                              <td>{mails.toAddress}</td>
                          </tr>
                        </>
                        
                      )
                  )
              )
                ) : (data.length === 0 && newData.length === 0) ? (  // khong cos data
                    
                    <tr>
                          <td colSpan="7" className="text-center">Không có dữ liệu cần thiết</td>
                    </tr>
                ) : (
                        newData.map((mails) => (
                            (
                                <tr key={mails.id}>
                                    <td>{stt++}</td>
                                    <td>{mails.mailId}</td>
                                    <td>{mails.mailSubject.substring(0, 100)} ...</td>
                                    <td>{mails.mailContent.substring(0, 150)} ...</td>
                                    <td>{mails.attachment == null && <p>Không có</p>}
                                        {mails.attachment != '' && mails.attachment}</td>
                                    <td>{mails.toAddress}</td>
                                </tr>
                            )
                        )
                    ))}
            </tbody>
        </table>
        <div className='text-center mb-3 mt-2'> 
          <i>Đang hiển thị 2 dữ liệu mới nhất. Bấm vào từng nút Phân trang để xem chi tiết hơn</i>
        </div>
        <div className='text-center'>
          <div>
            <strong>Phân trang: </strong>
          </div>
          <div className='mt-2'>
            
              {(() => {
                const arrayIndex = [];

                for(let item = 1; item <= dataItem; item++){
                  arrayIndex.push(<button key={item} onClick={() => handlePagination(item)} className='btn btn btn-secondary ms-3'>{item}</button>);
                }

                return arrayIndex;
              })()}
              {/* {(dataItem === 0) ? (
                   <></>
                ) : (
                  
                    () => {
                      const arrayIndex = [];
      
                      for(let i = 0; i <= dataItem; i++){
                        arrayIndex.push(<button onClick={() => handlePagination(Number(i))} className='btn btn btn-secondary ms-3'>{i}</button>);
                      }
      
                      return arrayIndex;
                    }
                        
                    )()} */}
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    )
  }


export default Task;