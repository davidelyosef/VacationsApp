import React, { Component } from "react";
import "./navBar.css";
import { NavLink } from "react-router-dom";
import { store } from "../../redux/store";
import { displayIfConnected, displayIfNotConnected } from "../globalFunctions";

interface NavBarState {
    user: any;
}

export class NavBar extends Component<any, NavBarState> {

    public constructor() {
        super(undefined);
        this.state = {
            user: store.getState().logged
        }
    }

    public componentDidMount(): void {
        if (store.getState().logged === "" && localStorage.getItem("myUser")) {
            const newLocal: any = localStorage.getItem("myUser");
            let user = JSON.parse(newLocal);
            store.getState().logged = user;
            this.setState({ user });
        }
    }

    public render(): JSX.Element {
        return (
            <div className="navBar">

                <nav>
                    <div className="welcomeMsg" style={{ display: displayIfConnected() ? "" : "none" }}>
                        <p>Welcome <br /> {this.state.user.userName}</p>
                    </div>

                    <span>Vacations App</span>
                    <span style={{display: this.displayIfAdmin()}} className="seperate"><b> | </b></span>
                    <NavLink style={{display: this.displayIfAdmin()}} to="/admin" exact className="navBtn">Admin</NavLink>

                    <div className="loginLink">
                        <NavLink style={{ display: displayIfNotConnected() }} to="/login" exact className="navBtn">
                            Login
                        </NavLink>
                        <NavLink style={{ display: displayIfConnected() ? "" : "none" }} onClick={this.logingOut} to="/login" className="navBtn">
                            LogOut
                        </NavLink>
                    </div>

                </nav>
            </div>
        )
    }
    
    private displayIfAdmin(): string {
        return (this.state.user.userName === "admin" ? "" : "none");
    }

    private logingOut = (e: any): void => {
        if (window.confirm('Are you sure you want to log out?') === true) {
            store.getState().logged = "";
            localStorage.removeItem('myUser');
        }
    }

}