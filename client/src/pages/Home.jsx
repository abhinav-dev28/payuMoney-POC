import axios from "axios";
import { useEffect, useState } from "react";
import { Data } from "/public/constant";

const Home = () => {
  const [form, setForm] = useState("");
  const firstname = "Abhinav Maurya";
  const email = `Abhinav${Math.floor(Math.random() * 56)}@fitnearn.com`;
  const mobile = `85${Math.floor(Math.random() * 56000)}485`;

  useEffect(() => {
    const formData = document.getElementById("payment_post");
    if (formData) {
      formData.submit();
    }
  }, [form]);

  const BuyNowHandler = async ({
    amount,
    product,
    firstname,
    email,
    mobile,
  }) => {
    try {
      const response = await axios.post("http://localhost:4000/get-payment", {
        amount,
        product,
        firstname,
        email,
        mobile,
      });
      setForm(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: form }}
        style={{ marginTop: "20px", border: "1px solid #ddd", padding: "10px" }}
      />

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {Data.map((cur, i) => {
              return (
                <div key={i} className="p-4 md:w-1/3">
                  <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                    <img
                      className="lg:h-48 md:h-36 w-full object-cover object-center"
                      src={cur.image}
                      alt="blog"
                    />
                    <div className="p-6">
                      <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                        CATEGORY
                      </h2>
                      <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                        {cur.category}
                      </h1>
                      <p className="leading-relaxed mb-3">{cur.description}</p>
                      <div className="mb-3">
                        <button
                          onClick={() => {
                            BuyNowHandler({
                              amount: cur.price,
                              firstname,
                              email,
                              mobile,
                              product: {
                                title: cur.title,
                                price: cur.price,
                              },
                            });
                          }}
                          className="px-4  py-2 bg-black text-white rounded-md shadow"
                        >
                          Buy &#8377; {cur.price}{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
