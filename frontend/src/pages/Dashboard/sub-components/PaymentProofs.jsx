import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">User ID</th>
              <th className="w-1/3 py-2">Status</th>
              <th className="w-1/3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 text-center">{element.userId}</td>
                  <td className="py-2 px-4 text-center">{element.status}</td>
                  <td className="flex items-center py-4 justify-center gap-3">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-all duration-300"
                      onClick={() => handleFetchPaymentDetail(element._id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-all duration-300"
                      onClick={() => handlePaymentProofDelete(element._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td>No payment proofs are found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openDrawer && singlePaymentProof && (
        <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
      )}
    </>
  );
};

export default PaymentProofs;

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (
      openDrawer &&
      singlePaymentProof &&
      Object.keys(singlePaymentProof).length > 0
    ) {
      setAmount(singlePaymentProof.amount || "");
      setStatus(singlePaymentProof.status || "Pending");
    }
  }, [singlePaymentProof, openDrawer]);

  const dispatch = useDispatch();

  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  return (
    <section className="fixed bottom-0 left-0 w-full h-full bg-[#00000087] flex items-end z-50">
      <div className="bg-white w-full sm:max-w-[640px] sm:m-auto px-5 py-8 rounded-t-xl shadow-xl">
        <h3 className="text-[#D6482B] text-3xl font-semibold text-center mb-1">
          Update Payment Proof
        </h3>
        <p className="text-stone-600 text-center">
          You can update payment status and amount.
        </p>
        <form className="flex flex-col gap-5 my-5">
          <div className="flex flex-col gap-3">
            <label className="text-[16px] text-stone-600">User ID</label>
            <input
              type="text"
              value={singlePaymentProof.userId || ""}
              disabled
              className="text-xl px-1 py-2 bg-transparent border border-stone-600 rounded-md text-stone-600"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[16px] text-stone-600">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xl px-1 py-2 bg-transparent border border-stone-600 rounded-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[16px] text-stone-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xl px-1 py-2 bg-transparent border border-stone-600 rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Settled">Settled</option>
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[16px] text-stone-600">Comment</label>
            <textarea
              rows={5}
              value={singlePaymentProof.comment || ""}
              disabled
              className="text-xl px-1 py-2 bg-transparent border border-stone-600 rounded-md text-stone-600"
            />
          </div>
          <div>
            <Link
              to={singlePaymentProof.proof?.url || ""}
              className="bg-[#D6482B] flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl hover:bg-[#b8381e]"
              target="_blank"
            >
              Payment Proof (SS)
            </Link>
          </div>
          <div>
            <button
              type="button"
              className="bg-blue-500 w-full py-2 rounded-md text-white font-semibold text-xl hover:bg-blue-700"
              onClick={handlePaymentProofUpdate}
            >
              {loading ? "Updating Payment Proof" : "Update Payment Proof"}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="bg-yellow-500 w-full py-2 rounded-md text-white font-semibold text-xl hover:bg-yellow-700"
              onClick={() => setOpenDrawer(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
