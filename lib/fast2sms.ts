import axios from 'axios';

export const sendFastOTPSMS = async (
  phoneNumber: string,
  verificationCode: string
) => {
  const apiKey = process.env.FAST_SMS_API_KEY;
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${verificationCode}&route=otp&numbers=${phoneNumber}`;
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return true;
  } catch (err: any) {
    console.log(err?.response?.data, 'error while sending otp via fast sms');
    return false;
  }
};
