import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import PageBody from "../../components/page-body/PageBody";
import SideMenu from "../../components/side-menu/SideMenu";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
export default class Dashboard extends React.PureComponent {


    render() {
        return (
            // <div>
            //     {/* <PageBody /> */}
            //     <button onClick={this.onAddItem}>Add Item</button>
            //     <ResponsiveReactGridLayout
            //         onLayoutChange={this.onLayoutChange}
            //         onBreakpointChange={this.onBreakpointChange}
            //         {...this.props}
            //     >
            //         {_.map(this.state.items, el => this.createElement(el))}
            //     </ResponsiveReactGridLayout>
            // </div>
            <div className="flex">
                <SideMenu />
                <PageBody />
            </div>
        );
    }
}

// if (process.env.STATIC_EXAMPLES === true) {
//     import("./test-hook.jsx").then(fn => fn.default(Dashboard));
// }