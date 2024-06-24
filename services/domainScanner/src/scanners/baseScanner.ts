export interface IScanner {
  scan(domain: string): Promise<object>;
}
