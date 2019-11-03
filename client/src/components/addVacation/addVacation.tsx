import React, { Component } from "react";
import "./addVacation.css";
import { Vacation } from "../../models/vacation";
import { Heading } from "../heading/heading";
import { NavBar } from "../navBar/navBar";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import io from 'socket.io-client';
import axios from "axios";
import { disablePastDates } from "../globalFunctions";

let socket: any;
let errMsg: string;

interface AddVacationState {
    vacation: Vacation;
    user: any;
    selectedIMg: any;
    priceErr: string;
}

export class AddVacation extends Component<any, AddVacationState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            vacation: new Vacation(),
            user: store.getState().logged,
            selectedIMg: null,
            priceErr: "*"
        };
    }

    public componentWillUnmount(): void {
        if (socket) {
            socket.disconnect();
        }
    }

    public componentDidMount(): void {
        if (this.state.user) {
            if (this.state.user.userName === "admin") {
                socket = io.connect("http://localhost:3001");
            }
            else {
                this.props.history.push("/vacations");
            }
        }
        else {
            this.props.history.push("/login");
        }
    }

    public vacationsEmit(): void {
        socket.emit('admin-made-changes');
    }

    public setDescribe = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, describePlace: e.target.value } });
    }

    public setDestination = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, destination: e.target.value } });
    }

    public setStartDate = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, startDate: e.target.value } });
    }

    public setEndDate = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, endDate: e.target.value } });
    }

    public setImage = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, image: e.target.value } });
    }

    public setPrice = (e: any): void => {
        let price = e.target.value === "" ? undefined : +e.target.value;
        errMsg = "";

        if (price === undefined) {
            errMsg = "Please fill the price field.";
        }
        this.setState({ vacation: { ...this.state.vacation, price: e.target.value }, priceErr: errMsg });
    }

    public render(): JSX.Element {
        return (
            <div className="addVacation">
                <NavBar />

                <Heading>Add A Vacation</Heading>

                <label><span>Destination: </span></label>
                <input type="text" onChange={this.setDestination}
                    placeholder="Destination..."></input>

                <label><span>Describe Place: </span></label>
                <textarea onChange={this.setDescribe}
                    placeholder="Describe that place..."></textarea>
                <br /><br />

                <label><span>Starting At: </span></label>
                <input type="date" min={disablePastDates()} onChange={this.setStartDate}></input>

                <label><span>Ending At: </span></label>
                <input disabled={this.activeEndDate()} type="date" min={this.laterThanStart()} onChange={this.setEndDate}></input>

                <label><span>Image Name: </span></label>
                <input type="file" onChange={this.fileSelectHandler} accept="image/*" name="image"
                ></input>

                <label><span>Price: </span></label>
                <input type="number" onChange={this.setPrice}
                    placeholder="Price..." ></input>

                <br />

                <button type="button" onClick={this.addVacationButton} className="btn">Add Vacation</button>
            </div>
        )
    }

    // if i filled the startDate input it will active the endDate input
    private activeEndDate(): boolean {
        return (this.state.vacation.startDate ? false : true);
    }

    // disable earlier dates than the starting date
    private laterThanStart(): any {
        return this.state.vacation.startDate;
    }

    public fileSelectHandler = (e: any) => {
        this.setState({
            selectedIMg: e.target.files[0]
        })
    }

    private addVacationButton = (e: any) => {
        if (this.state.vacation.describePlace === "" ||
            this.state.vacation.destination === "" ||
            this.state.vacation.endDate === "" ||
            this.state.selectedIMg === null ||
            this.state.priceErr !== "" ||
            this.state.vacation.startDate === "") {
            alert("You must fill all the input fields before adding a vacation");
        }
        else {
            const fd = new FormData();
            const addedVacation = this.state.vacation;
            fd.append("myImage", this.state.selectedIMg, this.state.selectedIMg.name)
            fd.append("addedVacation", JSON.stringify(addedVacation))
            axios.post('http://localhost:8080/upload', fd)

            // const action = { type: ActionType.addVacation, payload: addedVacation };
            // store.dispatch(action);
            // this.vacationsEmit();

            setTimeout(() => {
            fetch("http://localhost:8080/api/vacations")
                .then(response => response.json())
                .then(vacations => {
                    const action = { type: ActionType.getAllVacations, payload: vacations };
                    store.dispatch(action);
                    this.vacationsEmit();
                });

                alert("New vacation has been successfully added");
                this.props.history.push("/admin");
            }, 1000);

        }
    }
}
