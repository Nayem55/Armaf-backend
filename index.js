const express = require("express");
const cors = require("cors");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

// database user and password
// fragrance-user

const api = new WooCommerceRestApi({
  url: "https://www.armafbd.com/",
  consumerKey: "ck_e88127714b881697c0169d319f10a119d96673c6",
  consumerSecret: "cs_279139331b875042c326fcb798e744c1534b6cc6",
  version: "wc/v3",
});

async function run() {
  try {
    //get products
    app.get("/getProducts", async (req, res) => {
      let allProducts = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        await api.get(`products?per_page=100&page=${page}`).then((response) => {
          allProducts = [...allProducts, ...response.data];
          totalPages = parseInt(response.headers["x-wp-totalpages"], 10);
          console.log(totalPages);
          page++;
        });
      }
      res.send(allProducts);
      console.log(allProducts.length);
    });

    //ger order list
    app.get("/getOrder", async (req, res) => {
      api
        .get("orders")
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    //post order
    app.post("/postOrder", async (req, res) => {
      const data = req.body;
      await api
        .post("orders", data)
        .then((response) => {
          const words = response.data.split(" ");
          const result = words.slice(5).join(" ").slice(4);
          console.log(result)
          res.send(result)
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    //get shipping info
    app.get("/shippingInDhaka", async (req, res) => {
      await api.get("shipping/zones/1/methods/2")
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    });
    app.get("/shippingOutDhaka", async (req, res) => {
      await api.get("shipping/zones/0/methods/3")
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    });
    
    //get all customer
    app.get("/getCustomer", async (req, res) => {
      await api
        .get("customers")
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    //post customer
    app.post("/postCustomer", async (req, res) => {
      const data = req.body;
      await api
        .post("customers", data)
        .then((response) => {
          res.send(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Server is runing");
});

app.listen(port, () => {
  console.log("Listening at port", port);
});
