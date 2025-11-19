declare module 'react-native-sqlite-storage' {
  interface DatabaseParams {
    name: string;
    location?: string;
    createFromLocation?: number | string;
  }

  interface ResultSet {
    insertId: number;
    rowsAffected: number;
    rows: {
      length: number;
      item(index: number): any;
      raw(): any[];
    };
  }

  interface Transaction {
    executeSql(
      sql: string,
      args?: any[],
      callback?: (transaction: Transaction, resultSet: ResultSet) => void,
      errorCallback?: (transaction: Transaction, error: any) => boolean
    ): void;
  }

  interface Database {
    transaction(
      callback: (transaction: Transaction) => void,
      errorCallback?: (error: any) => void,
      successCallback?: () => void
    ): void;
    
    executeSql(
      sql: string,
      args?: any[],
      success?: (result: ResultSet) => void,
      error?: (error: any) => void
    ): void;

    close(): void;
  }

  function openDatabase(params: DatabaseParams): Database;
  function openDatabase(
    name: string,
    version: string,
    displayName: string,
    size: number,
    callback?: () => void
  ): Database;

  function enablePromise(enabled: boolean): void;

  export default {
    openDatabase,
    enablePromise,
  };
}