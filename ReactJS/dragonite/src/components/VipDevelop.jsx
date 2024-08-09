import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from 'react-toastify';

const VipDevelop = () => {


  const DkVip = () => {
    window.alert("Dang ky vip");
  }
  const HuyVip = () => {
    window.alert("Da huy vip");
  }

  return (
    <>
      <button onClick={DkVip}>Dang ky Vip (patch: /vip)</button> 
      <button onClick={HuyVip}>Huy bo Vip (patch: /unvip)</button>
    </>
  )
}

export default VipDevelop