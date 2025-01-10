export const fetchAndSortOrders = async (offset: string) => {
  try {
    const response = await fetch(`/api/order?limit=50&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    const reversedData = [...data.orders].reverse();

    return reversedData;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw new Error('Error while loading orders');
  }
};
