class ApiResponse {
  constructor(message, data, statusCode) {
    this.statusCode = statuCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
export { ApiResponse };
