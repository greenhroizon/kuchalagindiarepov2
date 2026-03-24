import React, { useEffect, useState } from "react";
import useFadeInOnScroll from "./useFadeInOnScroll";
import { getAllCategoriesApi } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import { image_url } from "../../apis/env";
// import { showConsole } from "../apis/env";

const CategoryCard = () => {
  useFadeInOnScroll();

  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategoriesApi();

      return await response.data;
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categories] = await Promise.all([fetchAllCategories()]);
        console.log("categories", categories);

        setAllCategories(categories);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const handleCategoriesNavigate = (id) => {
    console.log("iddd", id);
    navigate(`/categories/${id}`);
  };

  console.log("allCategories", allCategories);

  return (
    <>
      <div className="signature-grid">
        <br/>
        <div className="container">
          <div className="common-sec">
            <h2 className="title">
              <span>Categories</span>
            </h2>
            <p className="sub">
             Shop appropriate to your wedding function
            </p>
          </div>
          {Array.isArray(allCategories) &&
            allCategories.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id || index}
                  className={isEven ? "category-item" : "category-item-2"}
                >
                  {console.log("item", item)}
                  {/* LEFT IMAGE (even index) */}
                  {isEven && (
                    <div className="category-image">
                      <img
                        src={`${image_url}/${item.imageUrl || "/images/Ellipse1.png"}`}
                        alt={item.name}
                      />
                    </div>
                  )}

                  {/* CONTENT */}
                  <div
                    className={`category-content ${!isEven ? "text-left" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleCategoriesNavigate(item?._id)}
                  >
                    <h2>{item.name}</h2>
                    <p className="sub">{item.description}</p>
                  </div>

                  {/* RIGHT IMAGE (odd index) */}
                  {!isEven && (
                    <div className="category-image">
                      <img
                        src={`${image_url}/${item.imageUrl || "/images/Ellipse1.png"}`}
                        alt={item.name}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default CategoryCard;
