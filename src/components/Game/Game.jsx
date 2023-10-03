import React, { useState } from 'react';
import Categories from './Categories';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const Game = () => {
    const subscriptionPrices = {
        Monthly: 50,
        Yearly: 500,
        '6 Months': 280,
    };
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [subscriptionData, setSubscriptionData] = useState({
        email: '',
        username: '',
        subscriptionPlan: 'Monthly',
    });
    const [selectedPlan, setSelectedPlan] = useState('Monthly');
    const [price, setPrice] = useState(subscriptionPrices[selectedPlan]);


    const openModal = (values) => {
        setSelectedGame(values);
        setIsOpen(true);
    };

    const closeModal = () => {
        setSelectedGame(null);
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

    const [data, setData] = useState(Categories);
    const filterResult = (catItem) => {
        const result = Categories.filter((curData) => {
            return curData.category === catItem;
        });
        setData(result);
    };

    return (
        <div className="games" id="games">
            <h2>Popular Games</h2>
            <ul>
                <li className="list" onClick={() => setData(Categories)}>
                    All
                </li>
                <li className="list" onClick={() => filterResult('pc')}>
                    Pc games
                </li>
                <li className="list" onClick={() => filterResult('mobile')}>
                    Mobile games
                </li>
            </ul>
            <div className="cardBx">
                {data.map((values) => {
                    const { id, title, price, image } = values;
                    return (
                        <div className="card" key={id}>
                            <img src={image} alt="" />
                            <div className="content">
                                <h4>{title}</h4>     
                                <div><span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star checked"></span>
                                        <span class="fa fa-star" id='notc'></span>
                                </div>
                                <div className="info">
                                    <p>
                                        Pricing <br /> <span>${price}</span>
                                    </p>
                                    <a href="#" onClick={() => openModal()}>
                                        Play Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                contentLabel="Subscription Modal"
                className="custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                {selectedGame && (
                    <>
                        <h2 className="modal-title">{selectedGame.title} Subscription</h2>
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
    );
};

export default Game;