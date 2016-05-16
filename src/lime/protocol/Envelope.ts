namespace lime {
  export interface Envelope {
    id?: string;
    from?: string;
    to?: string;
    pp?: string;
    metadata?: any;
  }

  export interface Reason {
    code: number;
    description?: string;
  }
}