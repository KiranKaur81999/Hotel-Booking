import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import { Tag, Divider } from 'antd';
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

function Profilescreen() {

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
    }, []);

    return (
        <div className='ml-3 mt-3'>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1">
                    <h1>My Profile</h1>
                    <br />
                    <h1>Name : {user.name}</h1>
                    <h1>Email : {user.email}</h1>
                    <h1>isAdmin : {user.isAdmin ? 'YES' : 'NO'}</h1>
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <MyBookings />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Profilescreen

export function MyBookings() {

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();


    useEffect(async () => {

        try {

            setloading(true);
            const data = (await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id })).data;
            console.log(data);
            setbookings(data);
            setloading(false);
            
        } catch (error) {
            setloading(false);
            seterror(error);
        }

    }, []);

    async function cancelBooking(bookingid, roomid) {
        try {

            setloading(true);
            const res = await (await axios.post('/api/bookings/cancelbooking', { bookingid, roomid })).data
            setloading(false);
            console.log(res);
            Swal.fire('Congratulations', 'Your Booking has been Cancelled', 'success').then(request =>{
                window.location.reload();
            })

        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(error);
            Swal.fire('Oops', 'Something went Wrong', 'error');
        }

    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && <Loader />}
                    {bookings && (bookings.map(booking => {
                        return <div className='bs'>
                            <h1>{booking.room}</h1>
                            <p><b>BookingId : </b>{booking._id}</p>
                            <p><b>Check In : </b>{booking.fromdate}</p>
                            <p><b>Check Out : </b>{booking.todate}</p>
                            <p><b>Amount : </b>{booking.totalamount}</p>
                            <p><b>Status : </b>{booking.status == 'booked' ? (<Tag color="green">CONFIRMED</Tag>) :
                                (<Tag color="red">CANCELLED</Tag>)}</p>
                            {booking.status !== 'cancelled' && <div className='text-right'>
                                <button className='btn btn-primary' onClick={() => cancelBooking(booking._id, booking.roomid)}>CANCEL BOOKING</button>
                            </div>}
                        </div>
                    }))}
                </div>
            </div>
        </div>
    )
}
