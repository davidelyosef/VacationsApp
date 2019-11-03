import React, { Component } from "react";
import "./adminPage.css";
import { Vacation } from "../../models/vacation";
import { NavLink } from "react-router-dom";
import { Heading } from "../heading/heading";
import { store } from "../../redux/store";
import { NavBar } from "../navBar/navBar";
import { ActionType } from "../../redux/actionType";
import io from 'socket.io-client';
import { Unsubscribe } from "redux";
import { formatDate } from "../globalFunctions";

let socket: any;

interface AdminState {
    vacations: Vacation[];
    modal: boolean;
    user: any;
}

export class AdminPage extends Component<any, AdminState> {

    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            vacations: [],
            modal: false,
            user: store.getState().logged
        };
        this.unsubscribeStore = store.subscribe(() =>
            this.setState({ vacations: store.getState().vacations }));
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
        socket.disconnect();
    }

    public vacationsEmit(): void {
        socket.emit('admin-made-changes');
    }

    public componentDidMount(): void {
        socket = io.connect("http://localhost:3001");
        if (this.state.user.userName === "admin") {
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
                    .catch(err => alert(err))
            }
            else {
                let vacationsFromStore = store.getState().vacations;
                this.setState({ vacations: vacationsFromStore });
                setTimeout(() => {
                }, 1500);
            }
        }
        else {
            this.props.history.push("/vacations");
        }

    }

    public delete = (e: any): void => {
        if (window.confirm('Are you sure you wish to delete this vacation?') === true) {
            let id = +e.target.getAttribute("data-key");
            alert("vacation will be delete: " + id);

            fetch(`http://localhost:8080/api/vacations/${id}`, {
                method: "DELETE"
            })
                .then(vacation => {
                    console.log("delete: ", vacation);
                    const action = { type: ActionType.deleteVacation, payload: id };
                    store.dispatch(action);
                    this.vacationsEmit();
                })
                .catch(err => alert(err));


        }
    }

    public render(): JSX.Element {
        return (
            <div className="adminPage">
                <NavBar />

                <Heading>Admin Page</Heading>

                <div>
                    <NavLink to="/addingVacation" className="btn"
                        style={{ display: this.displayIfAdmin() }}>Add Vacation</NavLink>
                    <h3 style={{ display: this.displayIfNotAdmin() }}>This page accessible to the Admin only</h3>
                </div>

                <br></br>
                {this.state.vacations.map(v =>
                    <div className="vacationCard" key={v.vacationID} style={{display: this.displayIfAdmin()}}>
                        <NavLink to={"/admin/" + v.vacationID} className="editVacation" title="edit">&#9998;</NavLink>
                        <button className="deleteVacation" onClick={this.delete} data-key={v.vacationID}
                            title="delete">&#10006;</button>

                        <p><b>{v.destination}</b></p>
                        <div className="description">
                            <p><b><u>Description: </u></b>{v.describePlace}</p>
                        </div>
                        <p><b><u>Start's at: </u></b>{formatDate(v.startDate)}</p>
                        <p><b><u>End's at: </u></b>{formatDate(v.endDate)}</p>
                        <p><b><u>Price: </u></b>{v.price}$</p>
                        <img src={'http://localhost:8080/assets/images/' + v.image} alt="" />
                    </div>
                )}

            </div>
        )
    }

    private displayIfNotAdmin(): string {
        return (this.state.user.userName === "admin" ? "none" : "");
    }

    private displayIfAdmin(): string {
        return (this.state.user.userName === "admin" ? "" : "none");
    }

}
