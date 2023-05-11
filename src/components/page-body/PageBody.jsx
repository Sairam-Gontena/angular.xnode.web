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
import _ from "lodash";
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
            items: [0, 1, 2, 3, 4].map(function (i, key, list) {
                return {
                    i: i.toString(),
                    x: i * 2,
                    y: 0,
                    w: 2,
                    h: 2,
                    add: i === (list.length - 1)
                };
            }),
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
                {/* {el.add ? (
                    <span
                        className="add text"
                        onClick={this.onAddItem}
                        title="You can add an item by clicking here, too."
                    >
                        Add +
                    </span>
                ) : (
                    <span className="text">{i}</span>
                )} */}
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
