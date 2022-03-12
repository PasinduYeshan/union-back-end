export enum DBErrorCode {
  NO_ERROR,
  UNKNOWN,
  FOREIGN_KEY,
  NOT_FOUND,
  DB_CONNECTION,
  DUPLICATE_ENTRY,
}

// Interface for DB error containing code and message
interface DBError {
  code: DBErrorCode;
  constraint?: string;
  message?: string;
}

export const NoError: DBError = { code: DBErrorCode.NO_ERROR };
export const NotFound: DBError = { code: DBErrorCode.NOT_FOUND };

export function mongoErrorToDBError(error: any): DBError {
  switch (error.code) {
    case 11000:
      return {
        code: DBErrorCode.DUPLICATE_ENTRY,
        message: error.message,
      };

    default:
      return { code: DBErrorCode.UNKNOWN, message: error.message };
  }
}
