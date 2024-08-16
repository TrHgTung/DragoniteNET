import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <>
        <div className="container">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                <a href="https://hoang-tung-site.vercel.app/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1" target='_blank'>
                © 2024 Hoàng Tùng
                </a>
                {/* <span className="mb-3 mb-md-0 text-body-secondary"></span> */}
                </div>

                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li className="ms-3"><a className="text-body-secondary no-underline-link" href="https://github.com/TrHgTung/DragoniteNET" target='_blank'>Xem mã nguồn</a></li>
                    <li className="ms-3"><a className="text-body-secondary no-underline-link" href="https://github.com/TrHgTung/DragoniteNET/blob/master/README.md" target='_blank'>Tài liệu hướng dẫn</a></li>
                </ul>
            </footer>
        </div>
      </>
    )
  }
}

export default Footer