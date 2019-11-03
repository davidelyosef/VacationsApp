import React, { Component } from "react";
import "./loginForm.css";
import { NavLink } from "react-router-dom";
import { User } from "../../models/user";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { NavBar } from "../navBar/navBar";

interface loginState {
    users: User[];
    username: string;
    password: string;
}

export class LoginForm extends Component<any, loginState> {

    public constructor() {
        super(undefined);
        this.state = {
            users: [],
            username: "",
            password: ""
        };
    }

    public componentDidMount(): void {
        fetch("http://localhost:8080/api/users")
            .then(response => response.json())
            .then(users => {
                this.setState({ users });
            })
            .catch(err => alert(err))

    }

    // set the input values into the state
    public setPassword = (e: any): void => {
        this.setState({ password: e.target.value });
    }
    public setUserName = (e: any): void => {
        this.setState({ username: e.target.value })
    }

    public render(): JSX.Element {
        return (
            <div className="loginForm">
                <NavBar/>

                <br /><br />

                <div className="content">
                    <p><b><u>Login</u></b></p>
                    <div className="image">
                        <img src="/assets/icons/ic1.png" alt="img"/>
                    </div>
                    <form>
                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="username">Username: </label>
                                <input type="text" name="username" placeholder="username" onChange={this.setUserName} id="userInput"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password: </label>
                                <input type="password" name="password" placeholder="password" onChange={this.setPassword} 
                                    id="passwordInput" autoComplete='password'/>
                            </div>
                        </div>
                        <div className="footer">
                            <button type="button" className="btn" onClick={this.loginButton}>Login</button>
                            <p>Don't have an acount yet?</p>
                            <NavLink to="/register" exact>Sign Up</NavLink>
                        </div>
                    </form>
                </div>

            </div>
        )
    }

    private loginButton = (e: any): any => {
        const username = this.state.username;
        const password = this.state.password;
        let isConnected = false;

        // check if the inserted username and password are correct
        this.state.users.forEach(u => {
            if (u.userName === username
                && u.password === password) {
                isConnected = true;     
                alert("Welcome " + username + " youv'e been logged in.");
                localStorage.setItem('myUser', JSON.stringify(u));
                username === "admin" ? this.props.history.push("/admin") : this.props.history.push("/vacations");

                const action = {
                    type: ActionType.getUser, payload: u
                };
                store.dispatch(action);
            }
        });
        if (isConnected === false) {
            alert("Wrong username or password");
        }
    }
}