import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Address.css'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import AddressCard from '../features/AddressCard'
import AddressPopup from '../features/AddressPopup/AddressPopup'
import { ToastContainer } from 'react-toastify'

const Address = (props) => {
    const [addressList, setAddressList] = useState([])

    const [cityList, setCityList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])

    const [tinhTP, setTinhTP] = useState('')
    const [quanHuyen, setQuanHuyen] = useState('')
    const [phuongXa, setPhuongXa] = useState('')
    const [soNha, setSoNha] = useState('')

    // const [districtIdx, setDistrictIdx] = useState(0)
    // const [cityIdx, setCityIdx] = useState(0)

    const navigate = useNavigate()

    const host = 'https://provinces.open-api.vn/api/?depth=3'

    async function fetchAddresses() {
        const response = await axios.get(`http://localhost:3000/address/${props.user.Id}`)
        setAddressList(response.data)
    }

    // async function fetchCity() {
    //     const response = await axios.get(host)
    //     setCityList(response.data)
    // }

    // async function fetchDistrict(city_code) {
    //     const response = await axios.get(host)
    //     setDistrictList(response.data[city_code].districts)
    // }

    // async function fetchWard(city_code, district_code) {
    //     const response = await axios.get(host)
    //     setWardList(response.data[city_code].districts[district_code].wards)
    // }

    // async function handleSubmit(event, close) {
    //     if (tinhTP != 'Chọn tỉnh thành' && quanHuyen != 'Chọn quận huyện' && phuongXa != 'Chọn phường xã' && soNha != '') {
    //         await axios.post(
    //             `http://localhost:3000/address/new?city=${tinhTP}&district=${quanHuyen}&ward=${phuongXa}&location=${soNha}&userid=${props.user.Id}`
    //         )
    //         alert('ADdress added')
    //         fetchAddresses()
    //         close()
    //     } else {
    //         alert('Xin vui lòng điền đầy đủ thông tin')
    //     }
    // }

    useEffect(() => {
        fetchAddresses()
    }, [])
    //File có popup dùng để create
    return (
        <div>
            <div className="address-header">
                <h1>Địa chỉ của tôi</h1>
                <Popup
                    trigger={
                        <button type="button" className="add-btn">
                            + Thêm địa chỉ mới
                        </button>
                    }
                    position="right center"
                    modal
                    // onClose={handleClose} // Call the handleClose method when the Popup is closed
                >
                    {(close) => (
                        <div className="popup-address">
                            <h1>Thêm địa chỉ</h1>
                            <AddressPopup user={props.user} fetchAddresses={fetchAddresses} close={close}/>
                        </div>
                    )}
                </Popup>
            </div>
            <hr />
            <div className="address-list">
                <h1>Địa chỉ</h1>
                <table className="address-table">
                    {addressList.map((address) => (
                        <tr key={address}>
                            <AddressCard
                                id={address.ID}
                                street={address.SoNha}
                                city={address.TinhTP}
                                district={address.QuanHuyen}
                                ward={address.PhuongXa}
                                fetchAddress={fetchAddresses}
                            />
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Address
