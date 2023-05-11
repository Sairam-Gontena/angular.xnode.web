import React from "react";
import X from '../../assets/x.svg';
import NODE from '../../assets/node.svg';
import NO_DP from '../../assets/no-dp.png';
import DCARD from '../../assets/d-card.svg';
import ALL_PRODUCTS from '../../assets/all-products.svg';
import BOT from '../../assets/bot.svg';
import BOT_CHAT from '../../assets/bot-chat.svg';
import FAVORITE from '../../assets/favorite.svg';
import RECENT from '../../assets/recent.svg';
import USER from '../../assets/user.svg';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './Home.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const header = (
        <img alt="Card" src={DCARD} />
    );
    const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" icon="pi pi-times" className="p-button-outlined p-button-secondary" />
        </div>
    );

    const onClickAdd = () => {
        navigate('/dashboard');
    }
    return (
        <div className="grid m-0 relative h-full">
            <div className="col-12 p-0">
                <div className="mini-header-wrapper flex">
                    <div className="w-9  flex justify-content-start flex-wrap">
                        <div class="flex align-items-center ml-4">
                            <img src={NODE} alt="" />
                            <img src={X} alt="" />
                        </div>
                        {/* <div class="flex align-items-center">2</div>
                <div class="flex align-items-center">3</div> */}
                    </div>
                    <div className="w-3">
                        {/* 4 */}
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-12 lg:col-12 p-8">
                <div className="grid m-0">
                    <div className="col-12 md:col-12 lg:col-12">
                        <p className="title">Hi, Good Morning</p>
                    </div>

                    <div className="col-6 md:col-6 lg:col-6">
                        <div className="p-inputgroup flex-1">
                            <Button icon="pi pi-search" className="search-icon" />
                            <InputText placeholder="Search" className="search-input" />
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12  mt-4">
                        <Button label="New with xbot AI" rounded icon="pi pi-check" size="small" className="rounded-btns" />
                        <Button label="New Project" rounded icon="pi pi-check" size="small" className="ml-4 rounded-btn-default" text raised />

                        <Button label="Import" rounded icon="pi pi-check" size="small" className="ml-4 rounded-btn-default" />

                    </div>
                    <div className="col-12  mt-4 flex" >
                        <div className="flex all-products">
                            <img src={ALL_PRODUCTS} alt="all products" className="mr-3" /> All Products
                        </div>
                        <div className="flex ml-4 recent-view">
                            <img src={RECENT} alt="all products" className="mr-3" />  Recently Viewd
                        </div>
                        <div className="flex ml-4  all-products">
                            <img src={USER} alt="all products" className="mr-3" />  Created by you
                        </div>
                        <div className="flex ml-4 all-products">
                            <img src={FAVORITE} alt="all products" className="mr-3" />   Favorites
                        </div>

                    </div>
                    <div className="col-12 mt-4">
                        <div className="card flex">
                            <Card title="FinBuddy" header={header} className="md:w-25rem">
                                <div class="flex justify-content-start flex-wrap ">
                                    <div class="flex align-items-center justify-content-center">
                                        <img src={NO_DP} alt="dp" className="no-dp" />
                                    </div>
                                    <div class="flex align-content-center flex-wrap ml-2">
                                        <div className="text-base">
                                            <p className="font-semibold">Created by you</p>
                                            <p>Last viewed 3 minutes ago</p>
                                        </div>

                                    </div>
                                </div>

                            </Card>
                            <Card className="md:w-25rem ml-8 new-card">
                                <div class="flex justify-content-center align-content-center flex-wrap text-7xl">
                                    <label htmlFor="" className="pointer" onClick={() => onClickAdd()}>+</label>
                                </div>

                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed bot-chat">
                <p>Hi, I’m xnode bot click here to get started</p>
            </div>
            <img src={BOT} alt="bot" className="bot fixed bottom-0 right-0" />

        </div>
    )
}


export default Home;