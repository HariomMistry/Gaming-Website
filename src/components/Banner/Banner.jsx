import React, { useState } from 'react'
import img from '../../assets/img/gamelogo1.avif'
import Modal from 'react-modal';
import axios from 'axios';
Modal.setAppElement('#root');

const Banner = () => {
  const subscriptionPrices = {
    Monthly: 50,
    Yearly: 500,
    '6 Months': 280,
  };
  const [isOpen, setIsOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    email: '',
    username: '',
    subscriptionPlan: 'Monthly',
  });
  const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const [price, setPrice] = useState(subscriptionPrices[selectedPlan]);


  const openModal = () => {

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the user changes the subscription plan, update the price
    if (name === 'subscriptionPlan') {
      setSelectedPlan(value);
      setPrice(subscriptionPrices[value]);
    }

    setSubscriptionData({
      ...subscriptionData,
      [name]: value,
    });
  };

  const handleSubscription = async (e) => {
    e.preventDefault();
    // Handle the subscription logic here, e.g., send data to your server.
    try {
      const response = await axios.post('http://localhost:5000/subscriptionData', {
        email: subscriptionData.email,
        username: subscriptionData.username,
        subscriptionPlan: subscriptionData.subscriptionPlan
      });
      if (response.status === 201) {
        const { productKey } = response.data;
        alert(`Subscription successful! Your product key is: ${productKey}`);
        closeModal();
      }
    } catch (e) {
      console.error('Error signing up:', e);
      alert('An error occurred.');
      closeModal();
    }
    console.log('Subscription Data:', subscriptionData);
    closeModal();
  };



  return (
    <div className='banner' id="home">
      <div className="bg">
        <div className="content">
          <h2>A Dedicated Gaming Hub
          </h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, fugiat!</p>
          <a href="#" className='btn' onClick={() => openModal()}>Join Now</a>
        </div>
        <img src={img} alt="" />
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Subscription Modal"
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        {(
          <>
            <h2 className="modal-title">Gemers Subscription</h2>
            <div className="modal-text">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={subscriptionData.email}
                onChange={handleChange}
                className="modal-input"
                required
              /><br />
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={subscriptionData.username}
                onChange={handleChange}
                className="modal-input"
                required
              />
              <label htmlFor="subscriptionPlan">Select a Plan:</label>  &nbsp;
              <select
                id="subscriptionPlan"
                name="subscriptionPlan"
                value={subscriptionData.subscriptionPlan}
                onChange={handleChange}
                className="modal-select"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="6 Months">6 Months</option>
              </select>
              <p>Pricing: <span>${price}</span></p>

            </div>
            <button className="modal-button" onClick={handleSubscription}>
              Subscribe
            </button>
            <button className="modal-button" onClick={closeModal}>
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Banner