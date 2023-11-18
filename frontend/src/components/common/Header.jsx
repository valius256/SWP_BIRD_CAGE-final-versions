import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../UserContext'
import jwtDecode from 'jwt-decode'
import Popup from 'reactjs-popup'
import LoginCard from '../features/LoginCard'
import logo from '../../../src/image/icons/logo.svg'
import './Header.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import { Badge } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import axios from 'axios'
// import banner from '../../image/banner/banner.png'

function Header() {
    const [seenMessage, setSeenMessage] = useState([])
    const [unseenMessage, setUnseenMessage] = useState([])

    useEffect(() => {
        async function fetchOrders() {
            const userId = JSON.parse(sessionStorage.loginedUser).Id
            const response = await fetch(`http://localhost:3000/order/loadUnseen/${userId}`)
            const orders = await response.json()

            const seen = orders.filter((order) => order.View_Status)
            const unseen = orders.filter((order) => !order.View_Status)
            setSeenMessage(seen)
            setUnseenMessage(unseen)
        }

        fetchOrders()
    })

    const { user } = useContext(UserContext)
    // const [email, setEmail] = useState('')
    const [keyword, setKeyword] = useState('')
    // const [googleUser, setGoogleUser] = useState('')
    // const [isTriggerClicked, setIsTriggerClicked] = useState(false)
    const navigate = useNavigate()

    function handleSignOut(e) {
        sessionStorage.removeItem('loginedUser')
        navigate('/')
        window.location.reload()
    }

    const handleLogin = () => {
        setIsTriggerClicked(true)
    }

    const handleClickto = () => {
        navigate('/')
    }

    const handleKeyword = (event) => {
        setKeyword(event.target.value)
    }

    const handleSearch = () => {
        if (keyword.trim() != '') navigate(`/filter/2/${keyword}`)
    }

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = async () => {
        setAnchorEl(null)
    }

    const handleSeen = async (id) => {
        await axios.patch(`http://localhost:3000/order/changetoSeen`, {
            id: id,
            userid: JSON.parse(sessionStorage.loginedUser).Id,
        });
    
        setUnseenMessage((unseen) => unseen.filter((notification) => notification.Id !== id));
    
        const foundNotification = unseenMessage.find((notification) => notification.Id === id);
        if (foundNotification) {
            setSeenMessage((seen) => [...seen, foundNotification]);
        }
    }


    return (
        <div id="header">
            <section className="header-top">
                <div className="service">
                    <div className="contact">
                        <div>
                            Chăm sóc khách hàng: <Link to="/Contact">0935039353</Link>
                        </div>
                    </div>
                </div>
                {user == null ? (
                    <Popup
                        contentStyle={{ width: '500px', height: '250px', borderRadius: '10px' }}
                        trigger={
                            <button type="button" className="login" onClick={handleLogin}>
                                <span>Đăng nhập</span>
                            </button>
                        }
                        position="center"
                        modal
                    >
                        {(close) => (
                            <div className="login-popup">
                                <LoginCard/>
                            </div>
                        )}
                    </Popup>
                ) : (
                    <div className="user-info">
                        <Link to="/user/profile" className="avatar">
                            <img src={user.Picture} alt="avatar" />
                        </Link>

                        <ul className="user-info-list">
                            {user.Role == 'Admin' || user.Role == 'Staff' ? (
                                <Link to="/admin" className="user-info-suboptions">
                                    <li>Thống kê</li>
                                </Link>
                            ) : (
                                <></>
                            )}
                            <Link to="/user/profile" className="user-info-suboptions">
                                <li>Thông tin cá nhân</li>
                            </Link>
                            <Link to="/user/purchase" className="user-info-suboptions">
                                <li>Đơn hàng của tôi</li>
                            </Link>
                            <Link onClick={(e) => handleSignOut(e)} className="user-info-suboptions">
                                <li>Đăng xuất</li>
                            </Link>
                        </ul>
                    </div>
                )}
            </section>

            <section className="header-bottom">
                <div className="logo" onClick={handleClickto}>
                    <img src={logo} style={{ height: '60px', width: '60px' }} />
                    BICA
                </div>
                <form className="search-container">
                    <input onChange={handleKeyword} className="search-bar" type="text" placeholder="Tìm kiếm" />
                    <button onClick={handleSearch} className="search-button">
                        🔍︎
                    </button>
                </form>
                <div className="text-white">
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <div className="text-white">
                            <Badge badgeContent={unseenMessage.length} color="error">
                                <NotificationsNoneIcon fontSize="large" />
                            </Badge>
                        </div>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button'
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        {unseenMessage.map((option) => (
                            <MenuItem key={option.Id} onClick={() => handleSeen(option.Id)} sx={{ backgroundColor: 'white' }}>
                                <div className="flex">
                                    <div className="w-12 ">
                                        <NotificationsActiveIcon></NotificationsActiveIcon>
                                    </div>
                                    <div>
                                        Đơn hàng có mã số #{option.Id}{' '}
                                        {option.Status_Paid.trim() == 'UnPaid' ? 'chưa được thanh toán' : 'đã thanh toán'} đang{' '}
                                        {option.Status_Shipping}
                                    </div>
                                </div>
                            </MenuItem>
                        ))}
                        {seenMessage.map((option) => (
                            <MenuItem key={option.Id} sx={{ backgroundColor: '#e0e0e0' }}>
                                <div className="flex">
                                    <div className="w-12 ">{/* <NotificationsActiveIcon></NotificationsActiveIcon> */}</div>
                                    <div>
                                        Đơn hàng có mã số #{option.Id}{' '}
                                        {option.Status_Paid.trim() == 'UnPaid' ? 'chưa được thanh toán' : 'đã thanh toán'} đang{' '}
                                        {option.Status_Shipping}
                                    </div>
                                </div>
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </section>
        </div>
    )
}

export default Header