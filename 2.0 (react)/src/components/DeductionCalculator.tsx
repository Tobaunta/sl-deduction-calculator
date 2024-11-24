import { useState, useEffect } from "react";
import styles from "./DeductionCalculator.module.css";

interface PriceData {
  price: number;
  reduction: number;
}

interface PriceCategory {
  [key: string]: PriceData;
}

type PriceCategoryType = "adult" | "reduced" | "school";

interface PriceYear {
  adult: PriceCategory;
  reduced: PriceCategory;
  school: PriceCategory;
}

interface PriceMatrix {
  [key: string]: PriceYear;
}

const priceMatrix: PriceMatrix = {
  y2024: {
    adult: {
      d30: { price: 1020, reduction: 68 },
      d90: { price: 2960, reduction: 87 },
      y1: { price: 10710, reduction: 117 },
      arlanda30: { price: 1430, reduction: 95 },
      ul30: { price: 1930, reduction: 127 },
    },
    reduced: {
      d30: { price: 650, reduction: 43 },
      d90: { price: 1880, reduction: 55 },
      y1: { price: 6830, reduction: 75 },
      arlanda30: { price: 1060, reduction: 71 },
      ul30: { price: 1290, reduction: 81 },
    },
    school: {
      s90: { price: 630, reduction: 22 },
      f90: { price: 770, reduction: 27 },
      s120: { price: 770, reduction: 20 },
      f120: { price: 830, reduction: 22 },
      sht: { price: 810, reduction: 18 },
      fht: { price: 900, reduction: 19 },
      svt: { price: 1020, reduction: 19 },
      fvt: { price: 1060, reduction: 20 },
      sulht: { price: 2360, reduction: 61 },
      fulht: { price: 1500, reduction: 34 },
      sulvt: { price: 3030, reduction: 64 },
      fulvt: { price: 1750, reduction: 35 },
    },
  },
};

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const DeductionCalculator = () => {
  const today = new Date();
  const defaultFromDate = new Date();
  defaultFromDate.setDate(today.getDate() - 7); // Set default from date to 7 days ago

  const [fromDate, setFromDate] = useState(formatDate(defaultFromDate));
  const [toDate, setToDate] = useState(formatDate(today));
  const [year, setYear] = useState("y2024");
  const [priceCategory, setPriceCategory] =
    useState<PriceCategoryType>("adult");
  const [ticket, setTicket] = useState("d30"); // Set default ticket to 30-day ticket
  const [result, setResult] = useState<string>("");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTicketOptions = () => {
    if (["adult", "reduced"].includes(priceCategory)) {
      return [
        { value: "d30", label: "30-dagar" },
        { value: "d90", label: "90-dagar" },
        { value: "y1", label: "År" },
        { value: "arlanda30", label: "Arlanda 30-dagar" },
        { value: "ul30", label: "UL/SL 30-dagar" },
      ];
    } else if (priceCategory === "school") {
      return [
        { value: "s90", label: "Skolbiljett 90-dagar" },
        { value: "f90", label: "Fritidsbiljett 90-dagar" },
        { value: "s120", label: "Skolbiljett 120-dagar" },
        { value: "f120", label: "Fritidsbiljett 120-dagar" },
        { value: "sht", label: "Skolbiljett Hösttermin" },
        { value: "fht", label: "Fritidsbiljett Hösttermin" },
        { value: "svt", label: "Skolbiljett Vårtermin" },
        { value: "fvt", label: "Fritidsbiljett Vårtermin" },
        { value: "sulht", label: "Skolbiljett UL/SL Hösttermin" },
        { value: "fulht", label: "Fritidsbiljett UL/SL Hösttermin" },
        { value: "sulvt", label: "Skolbiljett UL/SL Vårtermin" },
        { value: "fulvt", label: "Fritidsbiljett UL/SL Vårtermin" },
      ];
    }
    return [];
  };

  const calculatePrice = () => {
    if (fromDate && toDate && year && priceCategory && ticket) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      // Check if the selected ticket exists for the current price category
      const priceData = priceMatrix[year]?.[priceCategory]?.[ticket];
      if (!priceData) {
        return;
      }

      const price = priceData.price;
      const reduction = priceData.reduction;
      const totalReduction = diffDays * reduction;
      const refund = Math.max(price - totalReduction, 0);

      const ticketName =
        priceCategory === "school"
          ? getTicketOptions().find((opt) => opt.value === ticket)?.label
          : `${priceCategory === "adult" ? "Vuxen" : "Rabatterat"} ${
              getTicketOptions().find((opt) => opt.value === ticket)?.label
            }biljett`;

      setResult(
        `
${ticketName}
${fromDate} - ${toDate} = ${diffDays} dagar
${diffDays} * ${reduction} = ${totalReduction}kr
${price} - ${totalReduction} = ${refund}kr
      `.trim()
      );
    }
  };

  // Calculate price whenever any input changes
  useEffect(() => {
    calculatePrice();
  }, [fromDate, toDate, year, priceCategory, ticket]);

  useEffect(() => {
    // When price category changes, set a default ticket based on the category
    const options = getTicketOptions();
    if (options.length > 0) {
      const defaultTicket = priceCategory === "school" ? "s90" : "d30";
      setTicket(defaultTicket);
    }
  }, [priceCategory]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.doublerow}>
        <div className={styles.date}>
          <label htmlFor="fromdate">Startdatum</label>
          <input
            type="date"
            id="fromdate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
        </div>
        <div className={styles.date}>
          <label htmlFor="todate">Dagens / kontakt datum</label>
          <input
            type="date"
            id="todate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
          />
        </div>
      </div>

      <div className={styles.doublerow}>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          size={isMobile ? 1 : 3}
        >
          <option value="y2024">Reklamation 2024</option>
        </select>

        <select
          id="price"
          value={priceCategory}
          onChange={(e) =>
            setPriceCategory(e.target.value as PriceCategoryType)
          }
          size={3}
        >
          <option value="adult">Vuxen</option>
          <option value="reduced">Rabatterat</option>
          <option value="school">Skolungdom</option>
        </select>
      </div>

      <select
        className={styles.ticket}
        id="ticket"
        size={isMobile ? 3 : 5}
        value={ticket}
        onChange={(e) => setTicket(e.target.value)}
      >
        {getTicketOptions().map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <h4 id="calc">BERÄKNING</h4>
      <div id="result" className={styles.result} onClick={copyResult}>
        {result.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </form>
  );
};

export default DeductionCalculator;
