import { Category, Dashboard, Inventory, Person, Reorder } from '@mui/icons-material'
import React, { useState } from 'react'
import { Button, Tabs } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './styles.css'
import AddIcon from '@mui/icons-material/Add'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import logo from '../../../image/icons/logo.png'
import LogoutIcon from '@mui/icons-material/Logout'

export default function TabAdmin({ user }) {
    const navigate = useNavigate()
    const [activeButton, setActiveButton] = useState('/admin')

    const handleButtonClick = (path) => {
        navigate(path)
        setActiveButton(path)
    }
    function handleSignOut(e) {
        sessionStorage.removeItem('loginedUser')
        navigate('/')
        window.location.reload()
    }

    return (
        <Tabs className="bg-white w-64 fixed left-0 top-0 h-full">
            <div className="bg-white w-60 h-full">
                <div className="flex justify-center items-center m-4">
                    <img className="rounded-2xl w-24 " src={logo} onClick={() => handleButtonClick('/')} />
                </div>
                <div className="flex flex-col pl-4 gap-4">
                    <Button
                        startIcon={<Dashboard />}
                        onClick={() => handleButtonClick('/admin')}
                        fullWidth
                        classes={{ root: activeButton === '/admin' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        DashBoard
                    </Button>
                    {user.Role == 'Admin' && (
                        <>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleButtonClick('/admin/NewProduct')}
                                fullWidth
                                classes={{ root: activeButton === '/admin/NewProduct' ? 'active-dashboard' : '' }}
                                style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                            >
                                Thêm sản phẩm
                            </Button>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={() => handleButtonClick('/admin/NewComponent')}
                                fullWidth
                                classes={{ root: activeButton === '/admin/NewComponent' ? 'active-dashboard' : '' }}
                                style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                            >
                                Thêm thành phần lồng
                            </Button>
                        </>
                    )}
                    {/* <Button
                        onClick={() => handleButtonClick('/admin/NewCoupon')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/NewCoupon' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        disabled
                    >
                        Thêm khuyến mãi
                    </Button> */}

                    <Button
                        startIcon={<Inventory />}
                        onClick={() => handleButtonClick('/admin/Products')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Products' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Danh sách sản phẩm
                    </Button>

                    <Button
                        startIcon={<Inventory />}
                        onClick={() => handleButtonClick('/admin/Components')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Components' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Danh sách thành phần
                    </Button>
                    <Button
                        startIcon={<Category />}
                        onClick={() => handleButtonClick('/admin/Categories')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Categories' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Danh mục sản phẩm
                    </Button>
                    {/* <Button
                        onClick={() => handleButtonClick('/admin/Collection')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Collection' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        disabled
                    >
                        Collection
                    </Button> */}
                    {/* <Button
                        onClick={() => handleButtonClick('/admin/Attribute')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Attribute' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        disabled
                    >
                        Attribute
                    </Button> */}
                    <Button
                        startIcon={<Person />}
                        onClick={() => handleButtonClick('/admin/Users')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Users' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        // disabled
                    >
                        Người dùng
                    </Button>

                    <Button
                        startIcon={<Reorder />}
                        onClick={() => handleButtonClick('/admin/Orders')}
                        fullWidth
                        classes={{ root: activeButton === '/admin/Orders' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                        Đơn hàng
                    </Button>

                    <Button
                        onClick={(e) => handleSignOut(e)}
                        startIcon={<LogoutIcon />}
                        fullWidth
                        // classes={{ root: activeButton === '/admin/Coupons' ? 'active-dashboard' : '' }}
                        style={{ textTransform: 'none', display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}
                        // disabled
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </Tabs>
    )
}
