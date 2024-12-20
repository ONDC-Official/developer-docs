import HttpRequest from './httpRequest';

/**
 * Performs an HTTP POST or GET request to the specified endpoint with the provided data.
 *
 * @param data - The data to be sent in the request body for POST requests.
 * @param endpoint - The endpoint URL where the request will be sent.
 * @param method - The HTTP method to be used for the request (either 'POST' or 'GET').
 * @returns A promise that resolves to the response data from the API call.
 * @throws Will throw an error if the API call encounters an error.
 */

const postApi = async <T>({
  baseUrl,
  data,
  endpoint,
  method,
}: {
  baseUrl: string;
  endpoint: string;
  data: T;
  method: 'POST' | 'GET';
}) => {
  const apiCall = new HttpRequest(baseUrl, endpoint, method, {
    ...data,
  });

  const response = apiCall.send();
  return response;
};

export default postApi;
