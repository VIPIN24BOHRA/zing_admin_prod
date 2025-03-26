export const getRatings = async (startDate: number, endDate: number) => {
  console.log('calling get ratings');
  try {
    const apiUrl = `api/order/date?endDate=${endDate}&startDate=${startDate}`;
    const response = await fetch(apiUrl);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();

    return result.data ?? [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw new Error('Error while loading orders');
  }
};
