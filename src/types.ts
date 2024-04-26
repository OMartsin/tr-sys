export type EntityForDetails = {
    id: number;
    fields: Map<string, string>;
    orders: Order[];
}

export type Client = {
    id: number;
    name: string;
    address: string;
    edrpou: string;
    ipn: string;
    iban: string;
    bank: string;
    mfo: string;
    orders: Order[];
}

export type Transport = {
    id: number;
    brand: string;
    model: string;
    registrationNumber: string;
    weight: number;
    deliveries: Delivery[];
}

export type Truck = Transport & {
    fuelType: string;
    euroStandard: number;
}

export type Trailer = Transport & {
    capacity: number;
    trailerType: string;
}

export type Driver = {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    passportNumber: string;
    nationality: string;
    phoneNumber: string;
    ipn: string;
    driverLicenses: DriverLicense[];
    orders: Order[];
}

export type DriverLicense = {
    id: number;
    number: string;
    licenseCategories: string;
    issueDate: Date;
    expirationDate: Date;
}

export type Order = {
    id: number;
    name: string;
    clientName: string;
    price: number;
    departureDate: Date;
}

export type OrderForDetails = {
    id: number;
    name: string;
    clientName: string;
    price: number;
    departureDate: Date;
    delivery: Delivery;
}

export type Delivery = {
    id: number;
    trailerNumber: string;
    truckNumber: string;
    driverName: string;
    deliveryLogs: DeliveryLog[];
}

export type DeliveryLog = {
    id: number;
    description: string;
    timestamp: Date;
    latitude: number;
    longitude: number;
    address: string;
    status: string;
}

export type Statistics = {
    totalOrders: number;
    totalClients: number;
    totalTransports: number;
    totalDrivers: number;
    totalProfit: number;
}

export type FinanceOperation = {
    id: number;
    name: string;
    description: string;
    amount: number;
    timestamp: Date;
    type: string;
    orderId: number;
}

export type OrderInputDto = {
    id:  number | undefined;
    name: string;
    clientId:  number | undefined;
    price: number;
    departureDate: Date;
    delivery: DeliveryInputDto;
}

export type DeliveryInputDto = {
    id: number | undefined;
    trailerId: number | undefined;
    truckId:  number | undefined;
    driverId:  number | undefined;
}

export type idWithNames = {
    id: number;
    name: string;
}