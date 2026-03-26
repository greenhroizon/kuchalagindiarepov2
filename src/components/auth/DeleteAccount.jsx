import React, { useState } from "react";
import { deleteProfile } from "../../apis/service";
import { useNavigate } from "react-router-dom";
import { useToast } from "../common/Toast";

const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleDelete = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      await deleteProfile();

      // Optional: clear local storage / auth state
      localStorage.clear();
      sessionStorage.clear();

      toast.success("Account deleted successfully");

      navigate("/signin");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div>
      <div className="signin-image new-img">
        <div className="signin-page-1" style={{ height: "100%" }}>
          <div className="signin-form-page">
            <div className="signin-head">
              <h2>Delete Account</h2>
            </div>

            <div className="logout-center">
              <div className="logout-box mt-60-1">
                <h6>Are you sure you want to delete your account?</h6>
                <p>
                  Your account will be temporarily disabled. You can
                  log in again anytime.
                </p>

                <a href="#">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </a>

                <div className="logout-btn-flex">
                  <a
                    href="#"
                    className={`logout-btn log ${loading ? "disabled" : ""
                      }`}
                    onClick={handleDelete}
                    aria-disabled={loading}
                  >
                    {loading ? "Deleting..." : "Yes"}
                  </a>

                  <a
                    href="#"
                    className="logout-btn"
                    onClick={handleCancel}
                  >
                    No
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
