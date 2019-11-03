import { store } from "../redux/store";

export function displayIfNotConnected(): string {
    return(store.getState().logged === "" ? "" : "none");
}

export function displayIfConnected(): boolean {
    return(store.getState().logged === "" ? false : true);
}

export function formatDate(date: any): any {
    const d = new Date(date);
    let day: any = d.getDate();
    let month: any = (d.getMonth() + 1);
    const year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return day + "/" + month + "/" + year;
};
// disable past dates in the date input
export function disablePastDates(): string {
    const nd = new Date();
    const yr = nd.getFullYear();
    let month = new String(nd.getMonth() + 1);
    let day = new String(nd.getDate());
    if (day.length < 2) { day = '0' + day }
    if (month.length < 2) { month = '0' + month }
    return yr + "-" + month + "-" + day;
}





