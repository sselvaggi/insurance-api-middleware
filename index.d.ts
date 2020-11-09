export interface SessionRequest extends Express.Request {
  session: Client
}

export type ClientRole = 'admin' | 'user'

export interface Client {
  id: string
  name: string
  email: string
  role: ClientRole
}

export interface Credential {
  client_id: string
  client_secret: string
}

export interface Policy {
  id: string
  amountInsured: string
  email: string
  inceptionDate: string
  installmentPayment: boolean
  clientId: string
}

export interface Response<T = any>  {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  request?: any;
}

export interface ClientList {
  clients: Client[]
}

export interface ClientItem {
  client: Client[]
}

export interface PolicyList {
  policies: Policy[]
}

export interface PolicyItem {
  policy: Policy[]
}

export interface ClientListResponse extends Response<ClientList> {}

export interface ClientResponse extends Response<ClientItem> {}

export interface PolicyListResponse extends Response<PolicyList> {}

export interface PolicyResponse extends Response<PolicyItem> {}

export as namespace Insurance;
