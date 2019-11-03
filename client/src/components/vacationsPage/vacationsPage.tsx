import React, { Component } from "react";
import "./vacationsPage.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { NavBar } from "../navBar/navBar";
import io from 'socket.io-client';
import { Unsubscribe } from "redux";
import { displayIfConnected, displayIfNotConnected, formatDate } from "../globalFunctions";
import { Follow } from "../../models/follow";

let socket: any;
const newLocal: any = localStorage.getItem("myUser");

interface VacationsState {
    vacations: Vacation[];
    user: any;
    follows: Follow[];
}

export class VacationsPage extends Component<any, VacationsState> {

    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            vacations: store.getState().vacations,
            user: store.getState().logged,
            follows: []
        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                vacations: store.getState().vacations
            })
        )
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
        if (socket) {
            socket.disconnect();
        }
    }

    // check if i`m logged in
    public isConnected(): boolean {
        if (this.state.user) {
            return true;
        }
        else {
            // if i logged in before the user info will be save in the local storage
            if (localStorage.getItem("myUser")) {
                store.getState().logged = JSON.parse(newLocal);
                this.setState({ user: store.getState().logged });
                return true;
            }
            else {
                return false;
            }
        }
    }

    public componentDidMount(): void {
        socket = io.connect("http://localhost:3001");
        // get all the vacations in socket
        socket.on("admin-made-changes", (vacations: Vacation[]): void => {
            const action = { type: ActionType.getAllVacations, payload: vacations };
            store.dispatch(action);

        })
        if (this.isConnected()) {

            // get the id of the user who's connected
            let obj: any = store.getState().logged
            let theId = obj.userID;
            // get all the follows this user did
            fetch("http://localhost:8080/api/follows/" + theId)
                .then(response => response.json())
                .then(follows => {
                    if (follows) {
                        this.setState({ follows });
                    }
                })

            // if the store doen't has the vacations so fetch them
            if (store.getState().vacations.length < 1) {
                fetch("http://localhost:8080/api/vacations")
                    .then(response => response.json())
                    .then(vacations => {
                        this.setState({ vacations });
                        const action = {
                            type: ActionType.getAllVacations, payload: vacations
                        };
                        store.dispatch(action);
                    })
                    .catch(err => console.log(err))
            }
        }
        else {
            this.props.history.push("/login");
        }
    }

    public render(): JSX.Element {
        return (
            <div className="vacationsPage">
                <NavBar />

                <Heading>All Vacations</Heading>

                {/* display that message if i`m not connected */}
                <div style={{ display: displayIfNotConnected() }}>
                    <h3 style={{ color: "darkblue" }}>Hello guest</h3>
                    <h4>Please log in to see our vacations</h4>
                </div>

                {/* display that message if i`m connected as the admin */}
                <div style={{ display: displayIfConnected() && this.isAdmin() ? "" : "none" }}>
                    <h4>This page is for regular users, to see the vacations</h4>
                    <h4>please go to the Admin page</h4>
                </div>

                <div style={{ display: displayIfConnected() && !this.isAdmin() ? "" : "none" }}>
                    {/* display first the vacations who's been followed */}
                    {this.state.follows.map(f =>
                        <div className="vacationCard" key={f.destination}>
                            <div className="toFollow">
                                <span className="follow">Follow </span><br />
                                <input type="checkbox" className="checkBox" id={`checkBox-${f.vacationID}`}
                                    data-key={f.vacationID} onClick={this.handleChange} defaultChecked={this.isChecked(f.vacationID)} />
                                <label htmlFor={`checkBox-${f.vacationID}`}><span></span></label>
                            </div>

                            <p><b>{f.destination}</b></p>

                            <div className="description">
                                <p><b><u>Description: </u></b>{f.describePlace}</p>
                            </div>

                            <p><b><u>Start's at: </u></b>{formatDate(f.startDate)}</p>
                            <p><b><u>End's at: </u></b>{formatDate(f.endDate)}</p>
                            <p><b><u>Price: </u></b>{f.price}$</p>
                            <img src={'http://localhost:8080/assets/images/' + f.image} alt={f.image} />

                        </div>
                    )}

                    {/* if the vacation already been display before in the follows it won't be display here */}
                    {this.state.vacations.map(v =>
                        <div className="vacationCard" key={v.vacationID} style={{ display: this.isChecked(v.vacationID) === true ? "none" : "" }}>
                            <div className="toFollow">
                                <span className="follow">Follow </span><br />
                                <input type="checkbox" className="checkBox" id={`checkBox-${v.vacationID}`}
                                    data-key={v.vacationID} onClick={this.handleChange} defaultChecked={this.isChecked(v.vacationID)} />
                                <label htmlFor={`checkBox-${v.vacationID}`}><span></span></label>
                            </div>

                            <p><b>{v.destination}</b></p>

                            <div className="description">
                                <p><b><u>Description: </u></b>{v.describePlace}</p>
                            </div>

                            <p><b><u>Start's at: </u></b>{formatDate(v.startDate)}</p>
                            <p><b><u>End's at: </u></b>{formatDate(v.endDate)}</p>
                            <p><b><u>Price: </u></b>{v.price}$</p>
                            <img src={'http://localhost:8080/assets/images/' + v.image} alt={v.image} />

                        </div>
                    )}
                </div>
            </div>
        )
    }

    // check if i'm the admin
    private isAdmin(): boolean {
        return (this.state.user.userName === "admin" ? true : false);
    }

    // check if the vacation is in the follows
    public isChecked(vacationID: number): any {
        let check: boolean = false;
        if (this.state.follows) {
            this.state.follows.forEach(f => {
                if (f.vacationID === vacationID) {
                    check = true;
                    return true;
                }
            })
        }
        return check;
    }

    // checkBox functionality
    private handleChange = (e: any): void => {
        try {
        const vacationID = +e.target.getAttribute("data-key");
        const userID = this.state.user.userID;

        e.target.checked === true ? this.addToFollows(vacationID) : this.deleteFromFollows(userID, vacationID);
        }
        catch (err) {
            console.log(err.message)
        }
    }

    // delete the vacation from the follows list
    private deleteFromFollows(userID: number, vacationID: number): void {
        fetch(`http://localhost:8080/api/follows/${userID}/${vacationID}`, {
            method: "DELETE"
        })
    }

    // add the vacation to the follows list
    private addToFollows(vacationID: number): void {
        const userID = this.state.user.userID;

        fetch("http://localhost:8080/api/follows", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                vacationID: vacationID,
                userID: userID
            })
        })
            .then(response => response.json())
            .then(follows => {
                this.setState({ follows });
            })
            .catch(err => console.log(err.message));
    }

}