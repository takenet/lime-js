namespace Lime {

  export interface IEnvelope {
    id?: string;
    from?: string;
    to?: string;
    pp?: string;
    metadata?: any;
  }

  export interface IReason {
    code: number;
    description?: string;
  }
}
