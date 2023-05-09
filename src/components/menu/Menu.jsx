import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';


const MenuBar = (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <div className="card align-left">
                <Sidebar visible={visible} onHide={() => setVisible(false)}>
                    <div>
                        <a href="/">Home</a>
                        <hr />
                    </div>
                    {
                        props.options.map((option) =>
                            <div key={option.name}>
                                <a href={option.href}>{option.name}</a>
                                <hr />
                            </div>)
                    }
                </Sidebar>
                <Button icon="pi pi-align-justify" onClick={() => setVisible(true)} />
            </div>
        </div >
    )
}

export default MenuBar