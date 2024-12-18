import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Status = () => {
  const [status1, setStatus] = useState("");
  const [id1, setId] = useState("");
  const { status, id } = useParams();
  const navigate = useNavigate();
  console.log("before", status, id, status1, id1);
  useEffect(() => {
    setStatus(status);
    setId(id);
  }, [status, id]);

  console.log(status1, id1);
  return (
    <>
      <div className="h-screen flex items-center justify-center flex-col">
        <div className="w-1/2 shadow rounded-md py-5 flex items-center justify-center flex-col gap-y-4">
          <h1 className="text-4xl text-center">Status :{status} </h1>
          <h1 className="text-4xl text-center">Id : {id} </h1>
          <button
            onClick={() => navigate(-1)}
            className="px-12 py-2 bg-black text-white"
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Status;
