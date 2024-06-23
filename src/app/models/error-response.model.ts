export default interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: Error[];
  error: string;
}
