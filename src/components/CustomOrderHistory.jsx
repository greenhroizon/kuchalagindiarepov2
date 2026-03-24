import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import { getCustomOrderHistory } from "../apis/service";
import Loader from "./common/Loader";

const PAGE_SIZE = 10;

const CustomOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // FETCH ALL HISTORY ONCE
  const fetchOrderHistory = async () => {
    try {
      setLoading(true);

      const response = await getCustomOrderHistory();

      if (response?.success) {
        setOrders(response?.data?.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch order history", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // 🔹 FRONTEND PAGINATION LOGIC
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
      {loading && <Loader text="Loading orders..." />}

      <div className="checkout-page single-content pt-100 bg-index">
        <div className="container">
          <h2 className="mb-30">My Custom Orders</h2>

          {/* EMPTY STATE */}
          {!loading && orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: "12px",
              }}
            >
              <img
                src="/images/item-not-found.webp"
                alt="No history"
                style={{
                  width: "200px",
                  marginBottom: "16px",
                  opacity: 0.8,
                }}
              />
              <h3 style={{ marginBottom: "6px" }}>No History Found</h3>
              <p style={{ color: "#777" }}>
                You have not placed any custom orders yet.
              </p>
            </div>
          ) : (
            <>
              {/* TABLE */}
              <div className="tablecontainer">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Type</th>
                      <th>Delivery Address</th>
                      <th>Delivery Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{order.type}</td>
                        <td>{order.address}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`status ${order.status.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {orders.length > PAGE_SIZE && (
                <div style={{ marginTop: "30px", textAlign: "center" }}>
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={orders.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomOrderHistory;
