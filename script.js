elements = {
  buttons: {
    submit: document.getElementById("submit"),
  },
  inputs: {
    fromDate: document.getElementById("fromdate"),
    toDate: document.getElementById("todate"),
    year: document.getElementById("year"),
    price: document.getElementById("price"),
    ticket: document.getElementById("ticket"),
  },
  locations: {
    result: document.getElementById("result"),
  },
};

priceMatrix = {
  y2024: {
    adult: {
      d30: {
        price: 1020,
        reduction: 68,
      },
      d90: {
        price: 2960,
        reduction: 87,
      },
      y1: {
        price: 10710,
        reduction: 117,
      },
      arlanda30: {
        price: 1430,
        reduction: 95,
      },
      ul30: {
        price: 1930,
        reduction: 127,
      },
    },
    reduced: {
      d30: {
        price: 650,
        reduction: 43,
      },
      d90: {
        price: 1880,
        reduction: 55,
      },
      y1: {
        price: 6830,
        reduction: 75,
      },
      arlanda30: {
        price: 1060,
        reduction: 71,
      },
      ul30: {
        price: 1290,
        reduction: 81,
      },
    },
    school: {
      s90: {
        price: 630,
        reduction: 22,
      },
      f90: {
        price: 770,
        reduction: 27,
      },
      s120: {
        price: 770,
        reduction: 20,
      },
      f120: {
        price: 830,
        reduction: 22,
      },
      sht: {
        price: 810,
        reduction: 18,
      },
      fht: {
        price: 900,
        reduction: 19,
      },
      svt: {
        price: 1020,
        reduction: 19,
      },
      fvt: {
        price: 1060,
        reduction: 20,
      },
      sulht: {
        price: 2360,
        reduction: 61,
      },
      fulht: {
        price: 1500,
        reduction: 34,
      },
      sulvt: {
        price: 3030,
        reduction: 64,
      },
      fulvt: {
        price: 1750,
        reduction: 35,
      },
    },
  },
};

elements.inputs.fromDate.addEventListener("change", getPrice);
elements.inputs.toDate.addEventListener("change", getPrice);
elements.inputs.year.addEventListener("change", getPrice);
elements.inputs.ticket.addEventListener("change", getPrice);

elements.inputs.price.addEventListener("change", listTickets);

elements.locations.result.addEventListener("click", copyCalc);

console.log(elements.inputs.fromDate.value == "");

function getPrice() {
  if (
    elements.inputs.fromDate.value != "" &&
    elements.inputs.toDate.value != "" &&
    elements.inputs.year.value != "" &&
    elements.inputs.price.value != "" &&
    elements.inputs.ticket.value != ""
  ) {
    const fromDateInput = elements.inputs.fromDate;
    const toDateInput = elements.inputs.toDate;
    const yearInput = elements.inputs.year;
    const priceInput = elements.inputs.price;
    const ticketInput = elements.inputs.ticket;

    const fromDate = new Date(fromDateInput.value);
    const toDate = new Date(toDateInput.value);
    const diffDays = toDate.getDate() - fromDate.getDate() + 1;

    const priceData =
      priceMatrix[yearInput.value][priceInput.value][ticketInput.value];
    const price = priceData.price;
    const reduction = priceData.reduction;
    const totalReduction = diffDays * reduction;
    const refund = Math.max(price - totalReduction, 0);

    const ticketName = `${
      priceInput.value === "school"
        ? ticketInput.options[ticketInput.selectedIndex].text
        : ticketInput.options[ticketInput.selectedIndex].text +
          " " +
          priceInput.options[priceInput.selectedIndex].text
    }`;

    elements.locations.result.innerHTML = `
    <p>${ticketName}</p>
    <p>${fromDate.toISOString().substring(0, 10)} - ${toDate
      .toISOString()
      .substring(0, 10)} = ${diffDays} dagar</p>
    <p>${diffDays} * ${reduction} = ${totalReduction}kr</p>
    <p>${price} - ${totalReduction} = ${refund}kr</p>
  `;
  }
}

function listTickets() {
  elements.inputs.ticket.options.length = 0;
  if (["adult", "reduced"].includes(elements.inputs.price.value)) {
    elements.inputs.ticket.options.add(new Option("30-dagar", "d30"));
    elements.inputs.ticket.options.add(new Option("90-dagar", "d90"));
    elements.inputs.ticket.options.add(new Option("Års", "y1"));
    elements.inputs.ticket.options.add(
      new Option("30-dagar Arlanda", "arlanda30")
    );
    elements.inputs.ticket.options.add(new Option("30-dagar UL/SL", "ul30"));
  } else if (elements.inputs.price.value == "school") {
    elements.inputs.ticket.options.add(
      new Option("Skolbiljett 90-dagar", "s90")
    );
    elements.inputs.ticket.options.add(
      new Option("Fritidsbiljett 90-dagar", "f90")
    );
    elements.inputs.ticket.options.add(
      new Option("Skolbiljett 120-dagar", "s120")
    );
    elements.inputs.ticket.options.add(
      new Option("Fritidsbiljett 120-dagar", "f120")
    );
    elements.inputs.ticket.options.add(
      new Option("Skolbiljett Hösttermin", "sht")
    );
    elements.inputs.ticket.options.add(
      new Option("Fritidsbiljett Hösttermin", "fht")
    );
    elements.inputs.ticket.options.add(
      new Option("Skolbiljett Vårtermin", "svt")
    );
    elements.inputs.ticket.options.add(
      new Option("Fritidsbiljett Vårtermin", "fvt")
    );
    elements.inputs.ticket.options.add(
      new Option("Skolbiljett UL/SL Hösttermin", "sulht")
    );
    elements.inputs.ticket.options.add(
      new Option("Fritidsbiljett UL/SL Hösttermin", "fulht")
    );
    elements.inputs.ticket.options.add(
      new Option("Skolbiljett UL/SL Vårtermin", "sulvt")
    );
    elements.inputs.ticket.options.add(
      new Option("Fritidsbiljett UL/SL Vårtermin", "fulvt")
    );
  }
  elements.locations.result.innerHTML = `<p>Ange startdatum och biljett för att beräkna priset.</p>`;
}

function copyCalc() {
  const copyText = elements.locations.result.innerText;
  navigator.clipboard.writeText(copyText);
}

onload = function () {
  listTickets();
  elements.inputs.toDate.value = new Date().toISOString().substring(0, 10);
};
