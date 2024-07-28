import React, { Component, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../supports/AuthProvider';
import host from '../config/host.json';
import quote from '../config/quote.json';
import pokemon_color from '../config/pokemon-color.json';
import { toast } from 'react-toastify';

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

const Suggest = () => {
    const [data, setData] = useState('');
    const [pokemon, setPokemon] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();
    let stt = 1;  

    const getAssistant = localStorage.getItem('assistant');

    useEffect(() => {      
        switch(getAssistant){
            case '1':
                setPokemon('Venusaur');
                break;
            case '2':
                setPokemon('Pikachu');
                break;
            case '3':
                setPokemon('Charizard');
                break;
            case '4':
                setPokemon('Umbreon');
                break;
            case '5':
                setPokemon('Lapras');
                break;
            case '6':
                setPokemon('Dragonite');
                break;
            case '7':
                setPokemon('Blastoise');
                break;
            case '8':
                setPokemon('Dragapult');
                break;
            case '9':
                setPokemon('Clefable');
                break;
            default:
                setPokemon('Lucario');
                break;
        }
        // console.log(pokemon);
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

        const fetchData = async () => {
            try {
                const response = await axios.get(`${SERVER_API}${API_ENDPOINT}/Suggestions`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Accept-Language": "en-US,en;q=0.9",
                        'Content-Type': 'application/json',
                        'Charset':'utf-8',
                    }
                });
                
                setData(response.data.suggestions);

        }
        catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [auth.token]);    
    
    if (!data) {
        return (
        <div className='container mt-4'>
           <div className='mb-4'>
                <Link to="/" className='no-underline-link'>&lt; Quay lại danh sách</Link>
            </div>
            <div className='text-center'>
                <h5>Các gợi ý cho nội dung e-mail:  </h5>
                <div className='mb-4'>
                    <i>Hãy sao chép một trong những gợi ý nội dung e-mail phía dưới. Chúng có thể giúp bạn hoàn thiện e-mail tốt hơn</i>
                </div>
            </div>
           <div className='mt-4 mb-4'>
                <p> Đang tải dữ liệu...</p>
           </div>
        </div>
        );
    }

    const sayMessage = () => {
        const randQuote = quote;
        var itemRand = randQuote[Math.floor(Math.random()*randQuote.length)];

        toast.warning(itemRand);
    }

    const copyToClipboard = async (content, id) => {
        navigator.clipboard.writeText(content).then(() => {
            toast.success('Đã sao chép đoạn văn bản, hãy quay lại và dán');
        }).catch((error) => {
            toast.warning('Không thể sao chép, lỗi không xác định');
            console.log('Lỗi copyToClipboard: ', error);
        });

        try {
            const response = await axios.patch(`${SERVER_API}${API_ENDPOINT}/Suggestions/${id}`, 
                null, {
                headers: {
                    "Accept-Language": "en-US,en;q=0.9",
                    'Content-Type': 'application/json',
                    'Charset':'utf-8',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.data.success) {
                console.log('Đã up vote');
                window.location.reload();
            } else {
                console.error('có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra. lỗi: ', error);
        }
    }


    return (
      <div className='container mt-4'>
        <div className='mb-4'>
            <Link to="/" className='no-underline-link'>&lt; Quay lại danh sách</Link>
        </div>
        <div className='text-center'>
            <h5>Các gợi ý cho nội dung e-mail:  </h5>
            <div className='mb-4'>
                <i>Hãy sao chép một trong những gợi ý nội dung e-mail phía dưới. Chúng có thể giúp bạn hoàn thiện e-mail tốt hơn</i>
            </div>
        </div>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Nội dung được gợi ý</th>
                    <th scope="col">Hành động</th>
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
                                    {(stt <= 5) ? (
                                        <>
                                            <td><strong> {stt++}</strong> <i>(Được đề xuất cao)</i></td>
                                            <td>{mails.content}</td>
                                            <td><button className='btn btn-sm btn-secondary' onClick={() => copyToClipboard(mails.content, mails.id)}>Sao chép</button></td>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <td><strong> {stt++}</strong></td>
                                            <td>{mails.content}</td>
                                            <td><button className='btn btn-sm btn-secondary' onClick={() => copyToClipboard(mails.content, mails.id)}>Sao chép</button></td>
                                        </>
                                    )}
                               </tr>
                            )
                        )
                    ))}
            </tbody>
        </table>
        <div>
            <img src={`/pokemon/${pokemon}.png`}  alt={`${pokemon}`} title={`Xin chào, ${pokemon} hi vọng bạn tìm được nội dung mình cần`} onClick={sayMessage} />
        </div>
      </div>
    )
  }


export default Suggest;