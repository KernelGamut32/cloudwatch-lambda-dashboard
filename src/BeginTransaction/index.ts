export const handler = async (event: { httpMethod: any; body: any }) => {
  var method = event.httpMethod;

  if (method === 'POST') {
    return {
      statusCode: 200,
      headers: {},
      body: event.body,
    };
  }

  return {
    statusCode: 400,
    headers: {},
    body: 'Bad Request - Only POST is allowed',
  };
};
