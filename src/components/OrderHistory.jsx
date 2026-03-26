import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { getAllOrdersApi } from "../apis/service";
import Loader from "./common/Loader";
import { image_url } from "../apis/env";

const PAGE_SIZE = 10;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrdersApi();
        setOrders(res?.data || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔹 FRONTEND PAGINATION LOGIC
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = orders.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <>
      {loading && <Loader text="Loading orders..." />}

      <div className="checkout-page single-content pt-100 bg-index">
        <div className="container">
          <h2 className="mb-30">My Orders</h2>

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
                alt="No orders"
                style={{ width: "200px", marginBottom: "16px", opacity: 0.8 }}
              />
              <h3>No Orders Found</h3>
              <p style={{ color: "#777" }}>
                You haven’t placed any orders yet.
              </p>
            </div>
          ) : (
            <>
              {/* TABLE */}
              <div className="tablecontainer">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Order Id</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedOrders.map((order) => {
                      const firstItem = order.items?.[0];
                      const product = firstItem?.productId;

                      return (
                        <tr key={order._id}>
                          <td>
                            <div className="item-cell">
                              <div className="image-wrapper">
                                <img
                                  src={`${image_url}/${product?.imageUrl?.[0]}`}
                                  alt={product?.name}
                                />
                              </div>

                              <div className="item-info">
                                <div className="item-name">{product?.name}</div>
                                <div className="item-description">
                                  {product?.description}
                                </div>

                                {order.items.length > 1 && (
                                  <div className="item-description">
                                    +{order.items.length - 1} more item(s)
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="order-id">#{order._id.slice(-6)}</td>

                          <td className="date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>

                          <td className="total">
                            {order.currency} {order.amount} for{" "}
                            {order.items.length} item(s)
                          </td>

                          <td>
                            <div className="actions-cell">
                              <span
                                className={`status ${order.orderStatus.toLowerCase()}`}
                              >
                                {order.orderStatus}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default OrderHistory;
