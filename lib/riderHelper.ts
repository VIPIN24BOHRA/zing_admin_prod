import axios from 'axios';

export async function generatePidgeToken(userName: string, password: string) {
  const url = 'https://api.pidge.in/v1.0/store/channel/vendor/login';

  try {
    const response = await axios.post(url, {
      username: userName,
      password: password
    });

    console.log('Token:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('Error generating token:', error);
    return '';
  }
}

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

export async function createPidgeOrder(order: any, token: string) {
  const url = 'https://api.pidge.in/v1.0/store/channel/vendor/order';
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token
  };
  try {
    const response = await axios.post(url, order, { headers });
    console.log('data:', response.data);
    return response.data;
  } catch (error) {
    console.log(`error for create order : ${error}`);
    return '';
  }
}

export async function cancelPidgeOrder(id: string, token: string) {
  const url = `https://api.pidge.in/v1.0/store/channel/vendor/${id}/cancel`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token
  };
  try {
    const response = await axios.post(url, {}, { headers });
    console.log('data:', response.data);
    return response.data;
  } catch (error) {
    console.log(`error for create order : ${error}`);
    throw Error('error while canceling pidge order');
  }
}

export async function unallocatePidgeOrder(id: string, token: string) {
  const url = `https://api.pidge.in//v1.0/store/channel/vendor/${id}/fulfillment/cancel`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token
  };
  try {
    const response = await axios.post(url, {}, { headers });
    console.log('data:', response.data);
    return response.data;
  } catch (error) {
    console.log(`error for unallocate order : ${error}`);
    throw Error('error while unallocating pidge order');
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
    console.log(`error for create order : ${error}`);
    return '';
  }
}

export async function createPaymentSession(
  order_amount: number,
  order_id: string,
  phone: string,
  user_id: string
) {
  const body = {
    order_currency: 'INR',
    order_amount: order_amount,
    customer_details: {
      customer_id: user_id,
      customer_phone: phone
    },
    order_id: order_id
  };

  const headers: any = {
    'content-type': 'application/json',
    'x-client-id': process.env.CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01'
  };
  try {
    const res = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers
      // Ensures cookies are sent with the request
    });
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw Error('erro while createPaymentSession');
  }
}

export async function createTestPaymentSession(
  order_amount: number,
  order_id: string,
  phone: string,
  user_id: string
) {
  const body = {
    order_currency: 'INR',
    order_amount: order_amount,
    customer_details: {
      customer_id: user_id,
      customer_phone: phone
    },
    order_id: order_id,
    order_meta: {
      notify_url: 'https://dashboard.getzing.app/api/webhook/cashfreeTest'
    }
  };

  const headers: any = {
    'content-type': 'application/json',
    'x-client-id': process.env.TEST_CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.TEST_CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01'
  };
  try {
    const res = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers
      // Ensures cookies are sent with the request
    });
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    throw Error('erro while createPaymentSession');
  }
}

export async function getPaymentStatus(order_id: string) {
  const headers: any = {
    'content-type': 'application/json',
    'x-client-id': process.env.CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01'
  };
  try {
    const res = await fetch(`https://api.cashfree.com/pg/orders/${order_id}`, {
      method: 'GET',
      headers: headers
      // Ensures cookies are sent with the request
    });
    const result = await res.json();

    return result;
  } catch (err) {
    console.log(err);
    throw Error('erro while createPaymentSession');
  }
}

export async function getTestPaymentStatus(order_id: string) {
  const headers: any = {
    'content-type': 'application/json',
    'x-client-id': process.env.TEST_CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.TEST_CASHFREE_SECRET_KEY,
    'x-api-version': '2023-08-01'
  };
  try {
    const res = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${order_id}`,
      {
        method: 'GET',
        headers: headers
        // Ensures cookies are sent with the request
      }
    );
    const result = await res.json();

    return result;
  } catch (err) {
    console.log(err);
    throw Error('erro while createPaymentSession');
  }
}

export async function getETA(origin: any, destination: any) {
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!API_KEY) return null;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      const element = data.rows[0].elements[0];

      if (element.status === 'OK') {
        return {
          distance: element.distance.text,
          eta: element.duration.value + 180, // in sec
          eta_text: Math.floor((element.duration.value + 480) / 60) + ' min'
        };
      } else {
        console.error('Error:', element.status);
        return null;
      }
    } else {
      console.error('API Error:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Request Error:', error);
    return null;
  }
}
