import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import Loader from '../components/Loader'
import Error from '../components/Error'
import moment from 'moment'
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init({
    duration : 1000
});

function Bookingscreen() {
    const params = useParams();
    const [room, setroom] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    const room_id = params.room_id;
    const fromdate = moment(params.fromdate, 'DD-MM-YYYY');
    const todate = moment(params.todate, 'DD-MM-YYYY');
    const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;
    const [totalamount, settotalamount] = useState();

    useEffect(async () => {
        if(!localStorage.getItem('currentUser')){
            window.location.href = '/login';
        }

        try {
            setloading(true);
            const data = (await axios.post('/api/rooms/getroombyid', { roomid: params.roomid })).data;
            setroom(data);
            settotalamount(data.rentperday * totaldays);
            setloading(false);

        } catch (error) {
            seterror(true);
            console.log(error);
            setloading(false);
        }
    }, []);

    async function onToken(token) {
        const bookingdetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        }
        try{
            setloading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingdetails);
            setloading(false);
            Swal.fire('Congratulations', 'Your Room Booked Successfully', 'success').then(result => {
                window.location.href = '/bookings';
            });

        }catch(error){
            setloading(false);
            Swal.fire('Oops', 'Something went wrong', 'error');
        }
        
    }

    return (
        <div data-aos='flip-left'>
            {loading ? <h1><Loader /></h1> : room ? (<div>
                <div className='row justify-content-center m-5 bs'>
                    <h1>{room.name}</h1>
                    <div className='col-md-3' style={{ marginTop: '50px' }}>
                        <img src={room.imageurls[0]} className='bigimg' style={{ float: 'right' }} />
                    </div>
                    <div className='col-md-5'>
                        <div style={{ textAlign: 'right' }}>
                            <b>
                                <h1>Booking Details</h1>
                                <hr />
                                <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                                <p>From Date : {params.fromdate}</p>
                                <p>To Date : {params.todate}</p>
                                <p>Max Count : {room.maxcount}</p>
                            </b>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <b>
                                <h1>Amount</h1>
                                <hr />
                                <p>Total Days : {totaldays}</p>
                                <p>Rent Per Day : {room.rentperday}</p>
                                <p>Total Amount : {totalamount}</p>
                            </b>
                        </div>
                        <div>
                            <StripeCheckout
                                amount={totalamount * 100}
                                currency='INR'
                                token={onToken}
                                stripeKey="pk_test_51K98NmSDVKO5FUrwYIwA3hsovbwbeQW0CCGOL2stD6DugIHhTEa5hwpmQ2yvergV2KatIG16cThFSty6UuNoKUdI00MAInb3GA">
                                <button className='btn btn-primary' style={{ float: 'right' }}>Pay Now </button>
                            </StripeCheckout>
                        </div>
                    </div>
                </div>
            </div>) : <Error />}
        </div>
    )
}

export default Bookingscreen
