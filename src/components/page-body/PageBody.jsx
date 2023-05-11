import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "../header/Header";
import './PageBody.css';
import Dashboard from "../../pages/dashboard/Dashboard";
import { getJSONData } from "../../util/Util";
import Page from "../../pages/common-page/CommonPage";
import MenuBar from "../menu/Menu";
import Home from "../../pages/home/Home";
import { WidthProvider, Responsive } from "react-grid-layout";
import APPLE from '../../assets/Vector.svg';
import TESLA from '../../assets/tesla.svg';
import SNAP from '../../assets/snap.svg';
import ESSE from '../../assets/esse.svg';

import { Dropdown } from 'primereact/dropdown';




import _ from "lodash";
import LineChart from "./LineChart";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class PageBody extends React.PureComponent {

    static defaultProps = {
        className: "layout",
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 100
    };

    constructor(props) {
        super(props);

        this.state = {
            items: [
                {
                    "i": "0",
                    "x": 0,
                    "y": 0,
                    "w": 3,
                    "h": 2,
                    "add": false,
                    'widget': 'balance'
                },
                {
                    "i": "1",
                    "x": 3,
                    "y": 0,
                    "w": 3,
                    "h": 2,
                    "add": false,
                    "widget": 'income'
                },
                {
                    "i": "2",
                    "x": 6,
                    "y": 0,
                    "w": 3,
                    "h": 2,
                    "add": false,
                    "widget": 'expenses'

                },
                {
                    "i": "3",
                    "x": 9,
                    "y": 0,
                    "w": 3,
                    "h": 4,
                    "add": false,
                    "widget": 'stocks'

                },
                {
                    "i": "4",
                    "x": 0,
                    "y": 4,
                    "w": 6,
                    "h": 3,
                    "add": false,
                    "widget": 'line-chart'
                },
                {
                    "i": "5",
                    "x": 6,
                    "y": 4,
                    "w": 3,
                    "h": 3,
                    "add": false
                },
                {
                    "i": "6",
                    "x": 0,
                    "y": 8,
                    "w": 9,
                    "h": 3,
                    "add": false
                },
                {
                    "i": "7",
                    "x": 9,
                    "y": 8,
                    "w": 3,
                    "h": 4,
                    "add": false
                },

            ],
            newCounter: 0
        };

        // this.onAddItem = this.onAddItem.bind(this);
        this.onBreakpointChange = this.onBreakpointChange.bind(this);
    }

    createElement(el) {
        const removeStyle = {
            position: "absolute",
            right: "2px",
            top: 0,
            cursor: "pointer"
        };
        const i = el.add ? "+" : el.i;
        return (


            <div key={i} data-grid={el}>
                {(() => {
                    switch (el.widget) {
                        case 'balance':
                            return <div className="bal-card relative">
                                <p className="text-lg">Balance</p>
                                <p className="font-bold text-2xl mb-8" >$ 265,3433,34</p>
                                <div class="flex justify-content-between flex-wrap mt-8 pt-4 card-details">
                                    <div class="flex align-items-center justify-content-center">2765 8437 9087 ****</div>
                                    <div class="flex align-items-center justify-content-center">27/22</div>
                                </div>
                            </div>
                        case 'income':
                            return <div className="income-card relative">
                                <p className="text-lg font-bold mb-8">Income</p>
                                <p className="font-bold text-2xl mb-4" >$62,870.14</p>
                                <div class="flex justify-content-between flex-wrap ">
                                    <div class="flex align-items-center justify-content-center">This week’s income</div>
                                    <div class="flex align-items-center justify-content-center income-percentage">+12.23%</div>
                                </div>
                            </div>
                        case 'expenses':
                            return <div className="income-card relative">
                                <p className="text-lg font-bold mb-8">Expenses</p>
                                <p className="font-bold text-2xl mb-4" >$70,279.81</p>
                                <div class="flex justify-content-between flex-wrap ">
                                    <div class="flex align-items-center justify-content-center">This week’s income</div>
                                    <div class="flex align-items-center justify-content-center income-percentage-neg">+12.23%</div>
                                </div>
                            </div>
                        case 'stocks':
                            return <div className="income-card relative">
                                <p className="text-lg font-bold mb-4">Stock Market</p>
                                <div className="flex">
                                    <img src={APPLE} alt="apple" />
                                    <div className="ml-3">
                                        <p className="stock-title font-semibold">Apple Inc.</p>
                                        <p className="stock-sub-title">AAPL</p>
                                    </div>
                                </div>
                                <div className="flex mt-4">
                                    <img src={TESLA} alt="tesla" />
                                    <div className="ml-3">
                                        <p className="stock-title font-semibold">Tesla Inc.</p>
                                        <p className="stock-sub-title">TSLA</p>
                                    </div>
                                </div>
                                <div className="flex mt-4">
                                    <img src={SNAP} alt="apple" />
                                    <div className="ml-3">
                                        <p className="stock-title font-semibold">Snap Inc.</p>
                                        <p className="stock-sub-title">SNAP</p>
                                    </div>
                                </div>
                                <div className="flex mt-4">
                                    <img src={ESSE} alt="apple" />
                                    <div className="ml-3">
                                        <p className="stock-title font-semibold">Essa Pharma Inc.</p>
                                        <p className="stock-sub-title">EPXI</p>
                                    </div>
                                </div>
                                <div className="flex mt-4">
                                    <img src={APPLE} alt="apple" />
                                    <div className="ml-3">
                                        <p className="stock-title font-semibold">Amazon</p>
                                        <p className="stock-sub-title">AMZN</p>
                                    </div>
                                </div>
                            </div>
                        case 'line-chart':
                            return <div className="income-card relative">
                                <div class="flex justify-content-between flex-wrap mb-4">
                                    <div class="flex align-items-center justify-content-center text-lg font-bold">All Expenses</div>
                                    <div class="flex align-items-center justify-content-center">
                                        <p className="mr-3">
                                            <span></span>
                                            Money Income
                                        </p>
                                        <p className="mr-3">

                                            Spending Income
                                        </p>
                                        <Dropdown options={[{ label: 'Daily' }, { label: 'Monthly' }, { label: 'Yearly' }]} optionLabel="label"
                                            editable placeholder="Select" className="w-full md:w-14rem" />
                                    </div>
                                </div>
                                <LineChart />
                            </div>

                        default:
                            return null
                    }
                })()}
                <span
                    className="remove"
                    style={removeStyle}
                    onClick={this.onRemoveItem.bind(this, i)}
                >
                    x
                </span>
            </div>
        );
    }




    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    }

    onLayoutChange(layout) {
        // this.props.onLayoutChange(layout);
        // this.setState({ layout: layout });
    }

    onRemoveItem(i) {
        console.log("removing", i);
        this.setState({ items: _.reject(this.state.items, { i: i }) });
    }
    render() {
        return (
            <div className="page-body-wrapper">
                {console.log('this.props', this.props, this.state.items)}
                {/* <MenuBar options={options}></MenuBar> */}
                <Header />
                <div className="page-content-wrapper">
                    {/* <button onClick={this.onAddItem}>Add Item</button> */}
                    <ResponsiveReactGridLayout
                        onLayoutChange={this.onLayoutChange}
                        onBreakpointChange={this.onBreakpointChange}
                        {...this.props}
                    >
                        {_.map(this.state.items, el => this.createElement(el))}
                    </ResponsiveReactGridLayout>

                </div>
            </div >
        )
    }
}
