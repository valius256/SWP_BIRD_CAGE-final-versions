import { React, useState, useRef, useEffect } from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TextField } from '@mui/material'
import axios from 'axios'
import Popup from 'reactjs-popup'

export default function AddressCard({ id, city, district, ward, street, fetchAddress }) {
    const [cityList, setCityList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [wardList, setWardList] = useState([])
    const [selectedCity, setSelectedCity] = useState(0)

    const [tinhTP, setTinhTP] = useState('')
    const [quanHuyen, setQuanHuyen] = useState('')
    const [phuongXa, setPhuongXa] = useState('')
    const [soNha, setSoNha] = useState('')

    const popupRef = useRef()

    const host = 'https://provinces.open-api.vn/api/?depth=3'
    async function fetchCity() {
        const response = await axios.get(host)
        setCityList(response.data)
        setTinhTP(city)
        setQuanHuyen(district)
        setPhuongXa(ward)
        setSoNha(street)
    }

    async function fetchDistrict(cityName) {
        const response = await axios.get(host)
        const cities = response.data
        for (let i = 0; i < cities.length; i++) {
            const city = cities[i]
            if (city.name === cityName) {
                setDistrictList(city.districts)
                break
            }
        }
    }

    async function fetchWard(cityName, districtName) {
        const response = await axios.get(host)
        const cities = response.data

        for (let i = 0; i < cities.length; i++) {
            const city = cities[i]
            if (city.name === cityName) {
                for (let j = 0; j < city.districts.length; j++) {
                    const district = city.districts[j]
                    if (district.name === districtName) {
                        setWardList(district.wards)
                        break
                    }
                }
                break
            }
        }
    }

    async function handleUpdate(event) {
        if (tinhTP != 'Chọn tỉnh thành' && quanHuyen != 'Chọn quận huyện' && phuongXa != 'Chọn phường xã' && soNha != '') {
            const json = {
                id: id,
                location: soNha,
                ward: phuongXa,
                district: quanHuyen,
                city: tinhTP
            }
            await axios.post(`http://localhost:3000/address/edit`, json)
            alert('Địa chỉ được cập nhật')
            fetchAddress()
        } else {
            alert('Xin vui lòng điền đầy đủ thông tin')
        }
    }
    function handleClose() {
        setDistrictList([])
        setWardList([])
    }

    useEffect(() => {
        fetchCity()
        fetchDistrict(city)
        fetchWard(city, district)
    }, [])
    async function handleDelete() {
        await axios.delete(`http://localhost:3000/address/delete/${id}`)
        console.log(id)
        alert('Địa chỉ đã được xoá')
        fetchAddress()
    }
    //Popup ở đây dùng để update
    return (
        <div id="adr-item">
            <div className="adr-item-detail">
                <div className="adr-grp">
                    <span className="adr-comp">{street}</span>
                    <br />
                    <span className="adr-comp">{city}, </span>
                    <span className="adr-comp">{district}, </span>
                    <span className="adr-comp">{ward}</span>
                </div>
                <div className="ftn">
                    <span className="edit-adr">
                        <Popup
                            trigger={
                                <button onClick={handleClose} style={{ marginLeft: '50px' }}>
                                    <ModeEditIcon fontSize="medium" />
                                </button>
                            }
                            position="right center"
                            modal
                            ref={popupRef} // Assign the ref to the Popup component
                            onClose={handleClose} // Call the handleClose method when the Popup is closed
                        >
                            {(close) => (
                                <div className="popup-address">
                                    <h1>Cập nhật địa chỉ</h1>
                                    <TextField
                                        className="location"
                                        id="city"
                                        onChange={(event) => {
                                            setSelectedCity(event.target.value)
                                            fetchDistrict(event.target.value)
                                            setTinhTP(event.target.value)
                                            setQuanHuyen('Chọn quận huyện')
                                            setPhuongXa('Chọn phường xã')
                                            setWardList([])
                                        }}
                                    >
                                        <option value="" selected>
                                            {tinhTP}
                                        </option>
                                        {cityList.map((city, index) => (
                                            <option key={city.code} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </TextField>
                                    <TextField
                                        className="location"
                                        id="district"
                                        onChange={(event) => {
                                            fetchWard(selectedCity, event.target.value)
                                            setQuanHuyen(event.target.value)
                                            setPhuongXa('Chọn phường xã')
                                        }}
                                    >
                                        <option value="" selected>
                                            {quanHuyen}
                                        </option>
                                        {districtList.map((district, index) => (
                                            <option key={district.code} value={district.name}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </TextField>

                                    <select
                                        className="location"
                                        id="ward"
                                        onChange={(event) => {
                                            setPhuongXa(event.target.value)
                                        }}
                                    >
                                        <option value="" selected>
                                            {phuongXa}
                                        </option>
                                        {wardList.map((ward, index) => (
                                            <option key={ward.code} value={ward.name}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        className="location"
                                        type="text"
                                        placeholder="Số nhà"
                                        value={soNha}
                                        onChange={(event) => {
                                            setSoNha(event.target.value)
                                        }}
                                    ></input>
                                    <div className="buttons">
                                        <button className="decision" onClick={close}>
                                            Đóng
                                        </button>
                                        <button
                                            className="decision"
                                            onClick={(event) => {
                                                handleUpdate(event)
                                            }}
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Popup>
                    </span>
                    <span className="delete-adr">
                        <button onClick={() => handleDelete()} style={{ marginLeft: '10px' }}>
                            <DeleteIcon fontSize="medium" />
                        </button>
                    </span>
                </div>
            </div>
        </div>
    )
}
