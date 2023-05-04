import { Card } from "primereact/card";
import React, { useState } from "react";
import "./LoginStyles.css";
import { Password } from 'primereact/password';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from 'primereact/divider';

export const Login = () => {
    let [userValues, setUserValues] = useState({ email: '', password: '' });

    const onSubmit = () => {
        localStorage.setItem('LOGGED_IN_USER', 'Admin')
        window.location.reload();
    }

    const onHandleChange = (event: any) => {
        setUserValues({ ...userValues, [event.target.name]: event.target.value });
    }

    return (
        <div className="bg-gradient-primary">
            <Card className="override-login-card">
                <div className="grid mt-8">
                    <div className="col-5 flex align-items-center justify-content-center ">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8yyVa_pXslIOSuwG7W4823jTHMRwuF9cfvg&usqp=CAU" ></img>
                    </div>

                    <div className="col-2">
                        <Divider layout="vertical"></Divider>
                    </div>

                    <div className="col-5 flex align-items-center justify-content-center">
                        <div className="p-fluid w-9">
                            <h2 className="primary-color">Welcome Back! </h2>
                            <span className="p-float-label w-full mt-4">
                                <InputText name="email" value={userValues.email} onChange={(e: any) => onHandleChange(e)} />
                                <label htmlFor="username">Email or Username</label>
                            </span>
                            <span className="p-float-label mt-4">
                                <Password name="password" value={userValues.password} toggleMask onChange={(e: any) => onHandleChange(e)} feedback={false} />
                                <label htmlFor="username">Password</label>
                            </span>
                            <Button className="mt-4 p-button-text primary-btn" label="Login" onClick={onSubmit}></Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
