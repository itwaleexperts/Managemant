const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const dataBaseConnection = require("./config/database.js");
const userRoutes=require("./routes/userRoute.js");
const adminRoutes=require("./routes/adminRoute.js")
const superRoutes=require("./routes/superAdminRoute.js")

const websiteSettingsRoutes = require("./routes/websiteSettingsRoutes.js")
const sendBusniessMaliRoutes = require("./routes/sentBusinessMail.js")

const aboutRoutes = require("./routes/Pages/aboutRoutes.js");
const accessbilityRoutes = require("./routes/Pages/accessbilityRoutes.js");
const affiliatesRoutes = require("./routes/Pages/affiliatesRoutes.js");
const careersRoutes = require("./routes/Pages/careeresRoutes.js");
const clubbedzzzRoutes = require("./routes/Pages/clubedzzRoutes.js");
const contactRoutes = require("./routes/Pages/contactRoutes.js");
const cookieRoutes = require("./routes/Pages/cookieRoutes.js");
const corporateRoutes = require("./routes/Pages/corporateRoutes.js");
const digitalRoutes = require("./routes/Pages/digitalRoutes.js");
const supplierRoutes = require("./routes/Pages/supplierRoutes.js");
const developementRoutes = require("./routes/Pages/developementRoutes.js");
const discountRoutes = require("./routes/Pages/discountRoutes.js");
const easyhotelRoutes = require("./routes/Pages/easyhotelRoutes.js");
const europeRoutes = require("./routes/Pages/europeRoutes.js");
const faqRoutes = require("./routes/Pages/faqRoutes.js");
const groupRoutes = require("./routes/Pages/groupRoutes.js");
const historyRoutes = require("./routes/Pages/historyRoutes.js");
const londonRoutes = require("./routes/Pages/londonRoutes.js");
const pledgeRoutes = require("./routes/Pages/pledgeRoutes.js");
const pressRoutes = require("./routes/Pages/pressRoutes.js");
const privacyRoutes = require("./routes/Pages/privacyRoutes.js");
const sitemapRoutes = require("./routes/Pages/sitemapRoutes.js");
const statementRoutes = require("./routes/Pages/statementRoutes.js");
const termsRoutes = require("./routes/Pages/termsRoutes.js");
const ukRoutes = require("./routes/Pages/ukRoutes.js");
const whistleblowingRoutes = require("./routes/Pages/whistleblowingRoutes.js");
const dealsRoutes = require("./routes/dealsRoutes.js");
const exploreRoutes = require("./routes/exploreRoutes.js");
const destinationRoutes = require("./routes/destinationRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js");
const hotelRoutes = require("./routes/hotelRoutes.js");
const roomRoutes = require("./routes/roomRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const reportRoutes = require("./routes/report.js");



dotenv.config();

const app = express();

app.use(express.json()); 
app.use(cors({
  origin: "https://yatraadda.jaspersoftwaresolutions.com",
  credentials: true,              
}));
app.use(cookieParser());

dataBaseConnection();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/super", superRoutes);

app.use("/api/about", aboutRoutes);
app.use("/api/accessbility", accessbilityRoutes);
app.use("/api/affilits",affiliatesRoutes );
app.use("/api/careers",careersRoutes );
app.use("/api/clubedzz",clubbedzzzRoutes );
app.use("/api/contact",contactRoutes );
app.use("/api/cookie",cookieRoutes );
app.use("/api/corporate",corporateRoutes );
app.use("/api/digital",digitalRoutes );
app.use("/api/supplier",supplierRoutes );
app.use("/api/develop",developementRoutes );
app.use("/api/discount",discountRoutes );
app.use("/api/easy",easyhotelRoutes );
app.use("/api/europe",europeRoutes );
app.use("/api/faq",faqRoutes );
app.use("/api/group",groupRoutes );
app.use("/api/history",historyRoutes );
app.use("/api/london",londonRoutes );
app.use("/api/pledge",pledgeRoutes );
app.use("/api/press",pressRoutes );
app.use("/api/privacy",privacyRoutes );
app.use("/api/sitemap",sitemapRoutes );
app.use("/api/statement",statementRoutes );
app.use("/api/terms",termsRoutes );
app.use("/api/uk",ukRoutes );
app.use("/api/whistle",whistleblowingRoutes );
app.use("/api/deals",dealsRoutes );
app.use("/api/explore",exploreRoutes );
app.use("/api/destination",destinationRoutes );
app.use("/api/booking",bookingRoutes );
app.use("/api/hotel",hotelRoutes );
app.use("/api/room",roomRoutes );
app.use("/api/cart",cartRoutes );
app.use("/api/report",reportRoutes );
app.use("/api/setting",websiteSettingsRoutes)
app.use("/api",sendBusniessMaliRoutes)


const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
