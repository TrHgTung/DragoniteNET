import React from 'react';
import { Link } from 'react-router-dom';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen || !localStorage.getItem('key_account')) return null;

  if(isOpen && localStorage.getItem('key_account').toString() == '1') return (
    <div className="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5" tabindex="-1" role="dialog" id="modalTour">
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-5">
            <h2 className="fw-bold mb-0">Chào mừng bạn</h2>

            <ul className="d-grid gap-4 my-5 list-unstyled small">
              <li className="d-flex gap-4">
                <div>
                  <h5 className="mb-0">Trải nghiệm cơ bản</h5>
                  Hãy trải nghiệm những tính năng ở mức độ cơ bản với tài khoản của bạn.
                </div>
              </li>
              <li className="d-flex gap-4">
                <div>
                  <h5 className="mb-0">Nâng cấp để có được nhiều hơn</h5>
                  Không bị giới hạn. Tại sao không? <Link to="/vip_reg">Nâng cấp lên VIP</Link>
                </div>
              </li>
              {/* <li className="d-flex gap-4">
                <div>
                  <h5 className="mb-0">Video embeds</h5>
                  Share videos wherever you go.
                </div>
              </li> */}
            </ul>
            <button type="button" className="btn btn-lg btn-primary mt-5 w-100" data-bs-dismiss="modal" onClick={onClose}>Bắt đầu sử dụng</button>
            {/* {children} */}
          </div>
        </div>
      </div>
    </div>
  )

  if(isOpen && localStorage.getItem('key_account').toString() == '2') return (
    <div className="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5" tabindex="-1" role="dialog" id="modalTour">
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-5">
            <h2 className="fw-bold mb-0">Chào mừng bạn - Bạn là VIP</h2>

            <ul className="d-grid gap-4 my-5 list-unstyled small">
              <li className="d-flex gap-4">
                <div>
                  <h5 className="mb-0">Ôi thật là VIP!</h5>
                  Giờ đây đã cho phép bạn có thể tải lên tệp với dung lượng cao hơn.
                </div>
              </li>
              <li className="d-flex gap-4">
                <div>
                  <h5 className="mb-0">Bạn xứng đáng VIP</h5>
                  Không còn bị 'chặn' số lượng mail được thêm mới nữa!
                </div>
              </li>
              <li className="d-flex gap-4">
                <div>
                  <h5 className="mb-0">Hãy giữ trải nghiệm này</h5>
                  Chúng tôi tin bạn vẫn sẽ còn thích tài khoản VIP.
                </div>
              </li>
            </ul>
            <button type="button" className="btn btn-lg btn-primary mt-5 w-100" data-bs-dismiss="modal" onClick={onClose}>Bắt đầu sử dụng</button>
            {/* {children} */}
          </div>
        </div>
      </div>
    </div>

  )
};

export default Modal;
