'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
// import { ProductsTable } from './products-table';
import { useEffect, useState } from 'react';
import { useAuth } from 'providers/authProvider/authContext';
import { useRouter } from 'next/navigation';
import StarRatings from 'react-star-ratings';
import VerticalChart from '@/components/chart/verticalChart';
import { AnalyticsDatePicker } from '@/components/analyticsDatePicker';
import { ExportCsvModal } from '@/components/exportCsvModal';
import { getRatings } from './analyticsHandler';
import Spinner from '@/components/ui/spinner';

// import { fetchAndSortOrders } from './ratingHandler';

const productsPerPage = 50;

export default function AnalyticsPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  interface Order {
    key: string;
    [key: string]: any;
  }

  const [chartData, setChartData] = useState<any[]>([]);
  const [feedBackData, setFeedBackData] = useState<any[]>([]);
  const [dataLoading, setdataLoading] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    handleSearchByDate(
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 9999))
    );
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const extractAvgRating = (orderList: any) => {
    const dateToRatingMap: any = {};
    const suggestionData: any = [];

    orderList.forEach((val: any) => {
      if (
        dateToRatingMap[new Date(val.createdAt).toLocaleDateString()] ==
        undefined
      ) {
        dateToRatingMap[new Date(val.createdAt).toLocaleDateString()] = [];
      }

      if (val?.rating?.tasteRating && val?.rating?.deliveryRating)
        dateToRatingMap[new Date(val.createdAt).toLocaleDateString()].push({
          deliveryRating: val?.rating?.deliveryRating,
          tasteRating: val?.rating?.tasteRating
        });
      if (val?.rating?.feedback) {
        suggestionData.push({
          ...val.rating,
          name: val.name,
          createdAt: val.createdAt,
          orderNo: val.orderNo
        });
      }
    });
    suggestionData.sort((a:any, b:any) => b.createdAt - a.createdAt);
    setFeedBackData(suggestionData);
    const chartRatingData: any = [];
    Object.keys(dateToRatingMap).forEach((key) => {
      const sum = dateToRatingMap[key].reduce(
        (acc: any, val: any) => {
          acc.avgDeliveryRating = acc.avgDeliveryRating + val.deliveryRating;
          acc.avgTasteRating = acc.avgTasteRating + val.tasteRating;
          return acc;
        },
        {
          avgDeliveryRating: 0,
          avgTasteRating: 0
        }
      );
      sum.avgDeliveryRating = (
        sum.avgDeliveryRating / dateToRatingMap[key].length
      ).toFixed(2);
      sum.avgTasteRating = (
        sum.avgTasteRating / dateToRatingMap[key].length
      ).toFixed(2);
      chartRatingData.push({
        ...sum,
        date: key,
        totalRating: dateToRatingMap[key].length
      });
    });
    setChartData(chartRatingData);
  };

  const handleSearchByDate = async (startDate: Date, endDate: Date) => {
    console.log(startDate.toDateString(), endDate.toDateString());
    setdataLoading(true);
    try {
      const result = await getRatings(startDate.getTime(), endDate.getTime());
      // setOrders(result);
      extractAvgRating(result);
    } catch (err) {
      console.log(err);
    }
    setdataLoading(false);
  };

  return (
    <Tabs defaultValue="order rating">
      <TabsContent value="order rating">
        <div className="flex w-full">
          <div className="basis-3/5">
            <div>
              <h3 className="text-sm font-bold mb-4">Average rating</h3>
              <div className="mb-8">
                <AnalyticsDatePicker handleSearch={handleSearchByDate} />
              </div>

              {dataLoading ? <Spinner /> : <VerticalChart data={chartData} />}
            </div>
          </div>

          <div className="basis-2/5 shadow-lg">
            <h3 className="py-2 font-bold px-4">User feedback</h3>
            <div className=" h-[80vh] overflow-scroll p-2">
              {feedBackData.map((val: any) => (
                <div className="py-6 border-b-[1px] border-[#aaa] border-dashed hover:bg-[#eee] px-4 shadow-lg mb-2">
                  <div className="flex flex-row justify-between mb-2">
                    <p className="flex flex-col">
                      <span className="font-semibold text-sm">{val.name}</span>{' '}
                      <span className="font-bold text-sm">#{val.orderNo}</span>
                    </p>
                    <div className="flex flex-col items-end">
                      <p className="font-semibold text-xs">
                        {new Date(val.createdAt).toDateString()}
                      </p>{' '}
                      <div className="flex">
                        <span className="">
                          <span className="text-xs font-semibold">D.R :- </span>
                          <StarRatings
                            starDimension="15px"
                            starSpacing="2px"
                            rating={val.deliveryRating}
                            starRatedColor="green"
                            numberOfStars={5}
                            name="Delivery Rating"
                          />
                        </span>
                        <span className="w-2"></span>
                        <span>
                          <span className="text-xs font-semibold">T.R :- </span>
                          <StarRatings
                            starDimension="15px"
                            starSpacing="2px"
                            rating={val.tasteRating}
                            starRatedColor="green"
                            numberOfStars={5}
                            name="Taste Rating"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm pl-4">{val.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
