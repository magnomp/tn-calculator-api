export interface ErrorDescriptor {
  code: string;
  message?: string;
}

export type OrError<T> = T | ErrorDescriptor;
