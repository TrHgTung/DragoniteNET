import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';
import pokemon_color from '../config/pokemon-color.json';
import Footer from './Footer';


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

const Welcome = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  localStorage.removeItem('key_access');
  const [auth, setAuth] = useState({
    token : localStorage.getItem('token') || null,
    isAuthenticated : localStorage.getItem('token') ? true : false
});

  const handleNavigation = () => {
    const check_username = localStorage.getItem('token');
    if (check_username) {
      localStorage.setItem('key_access', 'ok');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('token');
    setUsername(storedUsername);

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
            case 10:
              document.body.style.backgroundColor = Lucario;
              break;
            default:
              document.body.style.backgroundColor = 'white';
          }
        }
  }, []);

  const HandleAbout = () => {
    // window.alert('Mã nguồn: GitHub/@TrHgTung');
    toast.success('Mã nguồn thuộc về Hoàng Tùng (GitHub/@TrHgTung)');
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('SMTP_password');
    localStorage.removeItem('assistant');
    localStorage.removeItem('key_account');
    setAuth({ 
        token: null,
        isAuthenticated: false 
    });
    toast.warning('Đã đăng xuất. Hãy đăng nhập lại', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
  });
    navigate('/login');
}

  return (
    <>
      <div className="row mt-4">
        <div className="col-2">
          <div className='text-center ms-5 force-link' onClick={HandleAbout}>
            <h6>Giới thiệu về ứng dụng</h6>
          </div>
        </div>
        <div className="col-7">
        </div>
        <div className="col-3">
          {username ? (
              <>
              <div className="dropdown">
              <a class="btn btn-secondary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                
              </a>
                <ul className="dropdown-menu show" aria-labelledby="dropdownMenuLink">
                  <li><Link to='/' className="dropdown-item btn btn-outline-success" onClick={handleNavigation}>Truy cập dữ liệu</Link></li>
                  <li><a onClick={logout} className="dropdown-item force-link btn btn-outline-danger" >Đăng xuất</a></li>
                </ul>
              </div>
              </>
          ) : (
            <Link to='/login' className="btn btn-sm btn-primary" onClick={handleNavigation}>Đăng nhập</Link>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 text-center">
          <h2>Dragonite</h2>
          <p><i>Một ứng dụng gửi đồng loạt thư điện tử dành cho mọi người dùng</i></p>
          <div className='mt-3'>
            <button className='btn btn-secondary' onClick={handleNavigation}>Bắt đầu sử dụng</button>
          </div>
        </div>      
      </div>
      <div>
        <img src='/bg/0.png' alt="AllPokemon" />
      </div>
      <div className='ms-4 mb-4'>
        <p>Hình ảnh: The Pokémon Company / Game Freak / Nintendo (1996)</p>
      </div>
      <div>
        <Footer />
      </div>
    </>
  )
}

export default Welcome