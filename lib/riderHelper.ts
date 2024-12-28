import axios from 'axios';

export async function generateRiderToken(accessKey: String, secretKey: String) {
  const url =
    'https://synco-all-api.roadcast.co.in/api/v1/integration/generate_token';
  const headers: any = {
    'access-key': accessKey,
    'secret-key': secretKey
  };

  try {
    const response = await axios.post(url, {}, { headers });
    console.log('Token:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Error generating token:');
    return '';
  }
}

export async function createOrderApi(
  token: String,
  order: any,
  brandKey: string
) {
  const url = 'https://synco-all-api.roadcast.co.in/api/v1/integration/order';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    brandKey: brandKey
  };

  try {
    const response = await axios.post(url, order, { headers });
    console.log('data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating token:');
    return '';
  }
}

export async function createRiderOrder(order: any) {
  console.log(order);
  const res = await fetch('/api/createRiderOrder', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'include' // Ensures cookies are sent with the request
  });
  const result = await res.json();
  console.log(result);
}
