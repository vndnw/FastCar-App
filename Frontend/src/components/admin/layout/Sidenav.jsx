/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// import { useState } from "react";
import { Menu, Button } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

function Sidenav({ color }) {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");

  const dashboard = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
        fill={color}
      ></path>
      <path
        d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
        fill={color}
      ></path>
      <path
        d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
        fill={color}
      ></path>
    </svg>,
  ];

  const user = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 9C12.2091 9 14 7.20914 14 5C14 2.79086 12.2091 1 10 1C7.79086 1 6 2.79086 6 5C6 7.20914 7.79086 9 10 9ZM10 11C6.13401 11 3 14.134 3 18C3 18.5523 3.44772 19 4 19H16C16.5523 19 17 18.5523 17 18C17 14.134 13.866 11 10 11Z"
        fill={color}
      />
    </svg>,
  ];

  const discount = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H4ZM7 6C6.44772 6 6 6.44772 6 7C6 7.55228 6.44772 8 7 8C7.55228 8 8 7.55228 8 7C8 6.44772 7.55228 6 7 6ZM13 12C12.4477 12 12 12.4477 12 13C12 13.5523 12.4477 14 13 14C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12ZM5.70711 14.7071C5.31658 14.3166 5.31658 13.6834 5.70711 13.2929L13.2929 5.70711C13.6834 5.31658 14.3166 5.31658 14.7071 5.70711C15.0976 6.09763 15.0976 6.73079 14.7071 7.12132L7.12132 14.7071C6.73079 15.0976 6.09763 15.0976 5.70711 14.7071Z"
        fill={color}
      />
    </svg>,
  ];

  const carBrand = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4C2.89543 4 2 4.89543 2 6V14C2 15.1046 2.89543 16 4 16H5.5C5.77614 16 6 15.7761 6 15.5V14.5C6 13.6716 6.67157 13 7.5 13C8.32843 13 9 13.6716 9 14.5V15.5C9 15.7761 9.22386 16 9.5 16H10.5C10.7761 16 11 15.7761 11 15.5V14.5C11 13.6716 11.6716 13 12.5 13C13.3284 13 14 13.6716 14 14.5V15.5C14 15.7761 14.2239 16 14.5 16H16C17.1046 16 18 15.1046 18 14V6C18 4.89543 17.1046 4 16 4H4ZM5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9H15C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7H5Z"
        fill={color}
      />
    </svg>,
  ];

  const car = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 6.5C4.5 5.67157 5.17157 5 6 5H14C14.8284 5 15.5 5.67157 15.5 6.5V7H16.5C17.3284 7 18 7.67157 18 8.5V13.5C18 14.3284 17.3284 15 16.5 15H15.5V15.5C15.5 16.3284 14.8284 17 14 17H13C12.1716 17 11.5 16.3284 11.5 15.5V15H8.5V15.5C8.5 16.3284 7.82843 17 7 17H6C5.17157 17 4.5 16.3284 4.5 15.5V15H3.5C2.67157 15 2 14.3284 2 13.5V8.5C2 7.67157 2.67157 7 3.5 7H4.5V6.5ZM6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5C9 11.3284 8.32843 12 7.5 12C6.67157 12 6 11.3284 6 10.5ZM12.5 9C11.6716 9 11 9.67157 11 10.5C11 11.3284 11.6716 12 12.5 12C13.3284 12 14 11.3284 14 10.5C14 9.67157 13.3284 9 12.5 9Z"
        fill={color}
      />
    </svg>,
  ];

  const booking = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM4 8V16H16V8H4ZM7 10C6.44772 10 6 10.4477 6 11C6 11.5523 6.44772 12 7 12H13C13.5523 12 14 11.5523 14 11C14 10.4477 13.5523 10 13 10H7Z"
        fill={color}
      />
    </svg>,
  ];

  const document = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H4ZM5 6C5 5.44772 5.44772 5 6 5H14C14.5523 5 15 5.44772 15 6C15 6.55228 14.5523 7 14 7H6C5.44772 7 5 6.55228 5 6ZM5 9C5 8.44772 5.44772 8 6 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H6C5.44772 10 5 9.55228 5 9ZM5 12C5 11.4477 5.44772 11 6 11H10C10.5523 11 11 11.4477 11 12C11 12.5523 10.5523 13 10 13H6C5.44772 13 5 12.5523 5 12Z"
        fill={color}
      />
    </svg>,
  ];


  return (
    <>
      <div className="brand" style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="" />
        <span>Admin Dashboard</span>
      </div>
      <hr />
      <Menu theme="light" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/admin/dashboard">
            <span
              className="icon"
              style={{
                background: page === "admin/dashboard" || page === "admin" ? color : "",
              }}
            >
              {dashboard}
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>        <Menu.Item key="9">
          <NavLink to="/admin/users">
            <span
              className="icon"
              style={{
                background: page === "admin/users" ? color : "",
              }}
            >
              {user}
            </span>
            <span className="label">Users</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="10">
          <NavLink to="/admin/discount">
            <span
              className="icon"
              style={{
                background: page === "admin/discount" ? color : "",
              }}
            >
              {discount}
            </span>
            <span className="label">Discount</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="11">
          <NavLink to="/admin/car-brand">
            <span
              className="icon"
              style={{
                background: page === "admin/car-brand" ? color : "",
              }}
            >
              {carBrand}
            </span>
            <span className="label">Car Brand</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="12">
          <NavLink to="/admin/cars">
            <span
              className="icon"
              style={{
                background: page === "admin/cars" ? color : "",
              }}
            >
              {car}
            </span>
            <span className="label">Cars</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="13">
          <NavLink to="/admin/bookings">
            <span
              className="icon"
              style={{
                background: page === "admin/bookings" ? color : "",
              }}
            >
              {booking}
            </span>
            <span className="label">Bookings</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="14">
          <NavLink to="/admin/documents">
            <span
              className="icon"
              style={{
                background: page === "admin/documents" ? color : "",
              }}
            >
              {document}
            </span>
            <span className="label">Documents</span>
          </NavLink>
        </Menu.Item>

      </Menu>
      <div className="aside-footer">
        <div
          className="footer-box"
          style={{
            background: color,
          }}
        >
          <span className="icon" style={{ color }}>
            {dashboard}
          </span>
          <h6>Need Help?</h6>
          <p>Please check our docs</p>
          <a href="https://github.com/Vo-Xuan-Duong/BookingACar" target="_blank" rel="noopener noreferrer">
            <Button type="primary" className="ant-btn-sm ant-btn-block">
              DOCUMENTATION
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}

export default Sidenav;
