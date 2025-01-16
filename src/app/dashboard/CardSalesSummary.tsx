"use client";

import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CardSalesSummary = () => {
  // Memanggil data dari endpoint Dashboard
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  // Mengambil array salesTrend (bentuk: { date: Date; totalPenjualan: number }[])
  const salesTrend = data?.salesTrend || [];

  const [timeframe, setTimeframe] = useState("week"); // contoh

  // Total penjualan di periode (sum of totalPenjualan)
  const totalSales = salesTrend.reduce(
    (acc, curr) => acc + Number(curr.totalPenjualan || 0),
    0
  );

  // Mencari tanggal dengan penjualan tertinggi
  // (salesTrend harus tidak kosong agar reduce aman)
  const highestSalesData = salesTrend.reduce((acc, curr) => {
    return acc.totalPenjualan > curr.totalPenjualan ? acc : curr;
  }, salesTrend[0] || { date: new Date(), totalPenjualan: 0 });

  // Format tanggal tertinggi
  const highestValueDate = highestSalesData.date
    ? new Date(highestSalesData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="m-5">Failed to fetch data</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Sales Summary
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div>
            {/* BODY HEADER */}
            <div className="flex justify-between items-center mb-6 px-7 mt-5">
              <div className="text-lg font-medium">
                <p className="text-xs text-gray-400">Total Penjualan</p>
                <span className="text-2xl font-extrabold">
                  {/* Tampilkan totalSales dalam format Rupiah */}
                  Rp {totalSales.toLocaleString("id-ID")}
                </span>
                {/* Contoh icon trending */}
                <span className="text-green-500 text-sm ml-2">
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  {/* Bisa diisi persentase growth jika ada */}
                  {/* 0.00% */}
                </span>
              </div>
              <select
                className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="year">Yearly</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* CHART */}
            <ResponsiveContainer width="100%" height={250} className="px-7">
              <BarChart
                data={salesTrend}
                margin={{ top: 0, right: 0, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tickFormatter={(value) =>
                    // Format Rupiah ringkas, misal ribuan atau jutaan
                    `Rp ${(value / 1000).toFixed(0)}k`
                  }
                  tick={{ fontSize: 12, dx: -1 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
                <Bar
                  dataKey="totalPenjualan"
                  fill="#3182ce"
                  barSize={10}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>{salesTrend.length || 0} data points</p>
              <p className="text-sm">
                Highest Sales Date:{" "}
                <span className="font-bold">{highestValueDate}</span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
