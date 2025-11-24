/**
 * Type definitions for @bandwidth/numbers
 * 
 * This file provides TypeScript type definitions for the @bandwidth/numbers npm package.
 * Package: https://www.npmjs.com/package/@bandwidth/numbers/v/1.10.0
 * 
 * Note: Methods named 'remove' in this file may actually be 'delete' in the actual package.
 * If the package uses 'delete', you can access it using bracket notation: Site['delete'](...)
 */

declare module '@bandwidth/numbers' {
  /**
   * Client configuration options
   */
  export interface ClientOptions {
    accountId: string;
    userName: string;
    password: string;
    baseUrl?: string;
    timeout?: number;
  }

  /**
   * Bandwidth API Client
   */
  export class Client {
    constructor(accountId: string, userName: string, password: string);
    constructor(options: ClientOptions);
    
    accountId: string;
    userName: string;
    password: string;
    baseUrl?: string;
    timeout?: number;
  }

  /**
   * Global options for the Client
   */
  export namespace Client {
    var globalOptions: {
      accountId?: string;
      userName?: string;
      password?: string;
      baseUrl?: string;
      timeout?: number;
    };
  }

  /**
   * Site information
   */
  export interface Site {
    id?: string;
    name?: string;
    description?: string;
    address?: Address;
  }

  /**
   * Address information
   */
  export interface Address {
    houseNumber?: string;
    streetName?: string;
    city?: string;
    stateCode?: string;
    zip?: string;
    addressType?: string;
  }

  /**
   * Site operations
   */
  export namespace Site {
    function list(client: Client, callback: (err: Error | null, sites: Site[]) => void): void;
    function list(callback: (err: Error | null, sites: Site[]) => void): void;
    function listAsync(client: Client): Promise<Site[]>;
    function listAsync(): Promise<Site[]>;
    
    function get(client: Client, siteId: string, callback: (err: Error | null, site: Site) => void): void;
    function get(siteId: string, callback: (err: Error | null, site: Site) => void): void;
    function getAsync(client: Client, siteId: string): Promise<Site>;
    function getAsync(siteId: string): Promise<Site>;
    
    function create(client: Client, site: Site, callback: (err: Error | null, site: Site) => void): void;
    function create(site: Site, callback: (err: Error | null, site: Site) => void): void;
    function createAsync(client: Client, site: Site): Promise<Site>;
    function createAsync(site: Site): Promise<Site>;
    
    function update(client: Client, siteId: string, site: Partial<Site>, callback: (err: Error | null, site: Site) => void): void;
    function update(siteId: string, site: Partial<Site>, callback: (err: Error | null, site: Site) => void): void;
    function updateAsync(client: Client, siteId: string, site: Partial<Site>): Promise<Site>;
    function updateAsync(siteId: string, site: Partial<Site>): Promise<Site>;
    
    function remove(client: Client, siteId: string, callback: (err: Error | null) => void): void;
    function remove(siteId: string, callback: (err: Error | null) => void): void;
    function removeAsync(client: Client, siteId: string): Promise<void>;
    function removeAsync(siteId: string): Promise<void>;
  }

  /**
   * Available number search query
   */
  export interface AvailableNumberQuery {
    areaCode?: string;
    state?: string;
    city?: string;
    zip?: string;
    npa?: string;
    nxx?: string;
    quantity?: number;
    pattern?: string;
    tollFree?: boolean;
    rateCenter?: string;
    lata?: string;
  }

  /**
   * Available phone number
   */
  export interface AvailableNumber {
    number: string;
    nationalNumber?: string;
    price?: string;
    location?: string;
    rateCenter?: string;
    state?: string;
    lata?: string;
  }

  /**
   * Available numbers operations
   */
  export namespace AvailableNumbers {
    function list(client: Client, query: AvailableNumberQuery, callback: (err: Error | null, numbers: AvailableNumber[]) => void): void;
    function list(query: AvailableNumberQuery, callback: (err: Error | null, numbers: AvailableNumber[]) => void): void;
    function listAsync(client: Client, query: AvailableNumberQuery): Promise<AvailableNumber[]>;
    function listAsync(query: AvailableNumberQuery): Promise<AvailableNumber[]>;
    
    function searchAndOrder(client: Client, query: AvailableNumberQuery, callback: (err: Error | null, order: Order) => void): void;
    function searchAndOrder(query: AvailableNumberQuery, callback: (err: Error | null, order: Order) => void): void;
    function searchAndOrderAsync(client: Client, query: AvailableNumberQuery): Promise<Order>;
    function searchAndOrderAsync(query: AvailableNumberQuery): Promise<Order>;
  }

  /**
   * Order information
   */
  export interface Order {
    id?: string;
    name?: string;
    siteId?: string;
    peerId?: string;
    existingTelephoneNumberOrderType?: string;
    areaCodeSearchAndOrderType?: AreaCodeSearchAndOrderType;
    tollFreeSearchAndOrderType?: TollFreeSearchAndOrderType;
    telephoneNumberListType?: TelephoneNumberListType;
    quantity?: number;
    orderCreateDate?: string;
    idRequested?: string;
    orderStatus?: string;
    orderCompleteDate?: string;
    orderType?: string;
    errorList?: ErrorItem[];
    partialAllowed?: boolean;
  }

  /**
   * Area code search and order type
   */
  export interface AreaCodeSearchAndOrderType {
    areaCode?: string;
    quantity?: number;
  }

  /**
   * Toll-free search and order type
   */
  export interface TollFreeSearchAndOrderType {
    quantity?: number;
  }

  /**
   * Telephone number list type
   */
  export interface TelephoneNumberListType {
    telephoneNumberList?: string[];
  }

  /**
   * Error item
   */
  export interface ErrorItem {
    code?: string;
    description?: string;
  }

  /**
   * Order operations
   */
  export namespace Order {
    function create(client: Client, order: Order, callback: (err: Error | null, order: Order) => void): void;
    function create(order: Order, callback: (err: Error | null, order: Order) => void): void;
    function createAsync(client: Client, order: Order): Promise<Order>;
    function createAsync(order: Order): Promise<Order>;
    
    function get(client: Client, orderId: string, callback: (err: Error | null, order: Order) => void): void;
    function get(orderId: string, callback: (err: Error | null, order: Order) => void): void;
    function getAsync(client: Client, orderId: string): Promise<Order>;
    function getAsync(orderId: string): Promise<Order>;
    
    function list(client: Client, callback: (err: Error | null, orders: Order[]) => void): void;
    function list(callback: (err: Error | null, orders: Order[]) => void): void;
    function listAsync(client: Client): Promise<Order[]>;
    function listAsync(): Promise<Order[]>;
  }

  /**
   * Phone number information
   */
  export interface PhoneNumber {
    id?: string;
    number?: string;
    nationalNumber?: string;
    name?: string;
    description?: string;
    applicationId?: string;
    siteId?: string;
    price?: string;
    createdTime?: string;
    numberState?: string;
    city?: string;
    lata?: string;
    rateCenter?: string;
    state?: string;
    tier?: string;
    vendorName?: string;
    vendorId?: string;
  }

  /**
   * Phone number operations
   */
  export namespace PhoneNumber {
    function list(client: Client, callback: (err: Error | null, numbers: PhoneNumber[]) => void): void;
    function list(callback: (err: Error | null, numbers: PhoneNumber[]) => void): void;
    function listAsync(client: Client): Promise<PhoneNumber[]>;
    function listAsync(): Promise<PhoneNumber[]>;
    
    function get(client: Client, numberId: string, callback: (err: Error | null, number: PhoneNumber) => void): void;
    function get(numberId: string, callback: (err: Error | null, number: PhoneNumber) => void): void;
    function getAsync(client: Client, numberId: string): Promise<PhoneNumber>;
    function getAsync(numberId: string): Promise<PhoneNumber>;
    
    function update(client: Client, numberId: string, number: Partial<PhoneNumber>, callback: (err: Error | null, number: PhoneNumber) => void): void;
    function update(numberId: string, number: Partial<PhoneNumber>, callback: (err: Error | null, number: PhoneNumber) => void): void;
    function updateAsync(client: Client, numberId: string, number: Partial<PhoneNumber>): Promise<PhoneNumber>;
    function updateAsync(numberId: string, number: Partial<PhoneNumber>): Promise<PhoneNumber>;
    
    function remove(client: Client, numberId: string, callback: (err: Error | null) => void): void;
    function remove(numberId: string, callback: (err: Error | null) => void): void;
    function removeAsync(client: Client, numberId: string): Promise<void>;
    function removeAsync(numberId: string): Promise<void>;
  }

  /**
   * Application information
   */
  export interface Application {
    id?: string;
    name?: string;
    incomingCallUrl?: string;
    incomingCallUrlCallbackTimeout?: number;
    incomingCallFallbackUrl?: string;
    incomingSmsUrl?: string;
    incomingSmsUrlCallbackTimeout?: number;
    incomingSmsFallbackUrl?: string;
    callbackHttpMethod?: 'GET' | 'POST';
    autoAnswer?: boolean;
  }

  /**
   * Application operations
   */
  export namespace Application {
    function list(client: Client, callback: (err: Error | null, applications: Application[]) => void): void;
    function list(callback: (err: Error | null, applications: Application[]) => void): void;
    function listAsync(client: Client): Promise<Application[]>;
    function listAsync(): Promise<Application[]>;
    
    function get(client: Client, applicationId: string, callback: (err: Error | null, application: Application) => void): void;
    function get(applicationId: string, callback: (err: Error | null, application: Application) => void): void;
    function getAsync(client: Client, applicationId: string): Promise<Application>;
    function getAsync(applicationId: string): Promise<Application>;
    
    function create(client: Client, application: Application, callback: (err: Error | null, application: Application) => void): void;
    function create(application: Application, callback: (err: Error | null, application: Application) => void): void;
    function createAsync(client: Client, application: Application): Promise<Application>;
    function createAsync(application: Application): Promise<Application>;
    
    function update(client: Client, applicationId: string, application: Partial<Application>, callback: (err: Error | null, application: Application) => void): void;
    function update(applicationId: string, application: Partial<Application>, callback: (err: Error | null, application: Application) => void): void;
    function updateAsync(client: Client, applicationId: string, application: Partial<Application>): Promise<Application>;
    function updateAsync(applicationId: string, application: Partial<Application>): Promise<Application>;
    
    function remove(client: Client, applicationId: string, callback: (err: Error | null) => void): void;
    function remove(applicationId: string, callback: (err: Error | null) => void): void;
    function removeAsync(client: Client, applicationId: string): Promise<void>;
    function removeAsync(applicationId: string): Promise<void>;
  }

  /**
   * Disconnect request
   */
  export interface DisconnectRequest {
    disconnectTelephoneNumberOrderType?: {
      telephoneNumberList?: string[];
    };
  }

  /**
   * Disconnect operations
   */
  export namespace Disconnect {
    function create(client: Client, disconnect: DisconnectRequest, callback: (err: Error | null, result: any) => void): void;
    function create(disconnect: DisconnectRequest, callback: (err: Error | null, result: any) => void): void;
    function createAsync(client: Client, disconnect: DisconnectRequest): Promise<any>;
    function createAsync(disconnect: DisconnectRequest): Promise<any>;
  }

  /**
   * Port-in request
   */
  export interface PortInRequest {
    loa?: string;
    subscriber?: {
      subscriberType?: string;
      businessName?: string;
      serviceAddress?: Address;
      accountNumber?: string;
      pin?: string;
      authorizedContact?: {
        name?: string;
        phoneNumber?: string;
        email?: string;
      };
    };
    billingTelephoneNumber?: string;
    listOfPhoneNumbers?: {
      phoneNumber?: string[];
    };
    siteId?: string;
    peerId?: string;
    triggerDate?: string;
  }

  /**
   * Port-in operations
   */
  export namespace PortIn {
    function create(client: Client, portIn: PortInRequest, callback: (err: Error | null, result: any) => void): void;
    function create(portIn: PortInRequest, callback: (err: Error | null, result: any) => void): void;
    function createAsync(client: Client, portIn: PortInRequest): Promise<any>;
    function createAsync(portIn: PortInRequest): Promise<any>;
    
    function get(client: Client, portInId: string, callback: (err: Error | null, result: any) => void): void;
    function get(portInId: string, callback: (err: Error | null, result: any) => void): void;
    function getAsync(client: Client, portInId: string): Promise<any>;
    function getAsync(portInId: string): Promise<any>;
  }
}
