export class Vacation {
    public constructor(
        public vacationID: number  = 0,
        public describePlace: string = "",
        public destination: string = "",
        public startDate: string = "",
        public endDate: string = "",
        public image: string = "",
        public price: number = 0,
    ){};
}