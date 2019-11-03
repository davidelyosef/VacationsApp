import React, { Component } from "react";
import "./register.css";
import { NavLink } from "react-router-dom";
import { User } from "../../models/user";
import { NavBar } from "../navBar/navBar";
import io from 'socket.io-client';

let socket: any;

interface RegisterState {
    users: User[];
    user: User;
    userError: any;
}

export class Register extends Component<any, RegisterState> {

    public constructor() {
        super(undefined);
        this.state = {
            users: [],
            user: new User(),
            userError: ""
        }
    }

    public componentWillUnmount(): void {
        socket.disconnect();
    }

    public componentDidMount(): void {
        socket = io.connect("http://localhost:3001");
        socket.on("user-check", (isExist: any): void => {
            if (isExist) {
                this.setState({ userError : "username already exist"});
            }
            else {
                this.setState({ userError : ""});
            }
        })
        
        fetch("http://localhost:8080/api/users")
            .then(response => response.json())
            .then(users => this.setState({ users }))
            .catch(err => alert(err))
    }

    // Adding functions
    public addFirstName = (e: any): void => {
        this.setState({ user: { ...this.state.user, firstName: e.target.value } });
    };
    public addLastName = (e: any): void => {
        this.setState({ user: { ...this.state.user, lastName: e.target.value } });
    };
    public addUserName = (e: any): void => {
     socket.emit('user-check', e.target.value);

        this.setState({ user: { ...this.state.user, userName : e.target.value } });
    };
    public addPassword = (e: any): void => {
        this.setState({ user: { ...this.state.user, password: e.target.value } });
    };

    public render(): JSX.Element {
        return (
            <div className="register">
                <NavBar/>

                <br/><br/>

                <div className="content">
                    <p><b><u>Sign Up</u></b></p>
                    <div className="image">
                        <img src="/assets/icons/male-icon.png" alt=""/>
                        <img src="/assets/icons/female-icon.png" alt=""/>
                    </div>

                    <div className="form">

                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" name="firstName" placeholder="First Name"
                                onChange={this.addFirstName} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" name="lastName" placeholder="Last Name"
                                onChange={this.addLastName} required /> 
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" placeholder="username"
                                onChange={this.addUserName} required />
                            <span>{this.state.userError}</span>

                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="text" name="password" placeholder="password"
                                onChange={this.addPassword} required />
                        </div>
                        
                    </div>
                    <div className="footer">
                        <button type="button" className="btn" onClick={this.addUser}>Sign Up</button>
                        <p>Already have an acount?</p>
                        <NavLink to="/login" exact>Login</NavLink>
                    </div>
                </div>

            </div>
        )
    }
    private addUser = (): void => {
        const userName = this.state.user.userName;
        const firstName = this.state.user.firstName;
        const lastName = this.state.user.lastName;
        const password = this.state.user.password;
        let isUsername = false;

        // check if the username already exist
        this.state.users.forEach(u => {
            if (u.userName === userName) {
                alert("The User name: " + userName + " is already in use");
                this.setState({ user: { ...this.state.user, userName: "" } });
                isUsername = true;
            }
        });

        // Validations
        if (firstName === "") {
            alert("You have to fill the first name field");
            isUsername = true;
        }
        else if(lastName === "") {
            alert("You have to fill the last name field");
            isUsername = true;
        }
        else if(userName === "" || userName.length < 4) {
            alert("Please fill the username field. it must contain at least 4 letters!");
            isUsername = true;
        }
        else if(password === "" || password.length < 4) {
            alert("Please fill the password field. it must contain at least 4 letters!");
            isUsername = true;
        }

        // if the username isn't exist add it:
        if (isUsername === false) {
            fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(this.state.user)
            })
                .then(response => response.json())
                .then(user => {

                    alert("user has been successfully added. user: " + user.firstName);
                    this.props.history.push("/login"); // Redirect to the users page.

                })
                .catch(err => alert(err));
        };
    }

}