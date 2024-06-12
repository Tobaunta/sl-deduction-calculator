elements = {
    buttons: {
        submit: document.getElementById("submit")
    },
    inputs: {
        fromDate: document.getElementById("fromdate"),
        toDate: document.getElementById("todate"),
        year: document.getElementById("year"),
        price: document.getElementById("price"),
        ticket: document.getElementById("ticket")
    },
    locations: {
        result: document.getElementById("result")
    }
  }
  
  priceMatrix = {
    y2024: {
        adult: {
            d30: {
                price: 1020,
                reduction: 68,
            }, 
            d90: {
                price: 2960,
                reduction: 87
            }, 
            y1: {
                price: 10710,
                reduction: 117
            },
            skol90: {
                price: 630,
                reduction: 22
            }, 
            fritid90: {
                price: 770,
                reduction: 27
            }, 
            skol120: {
                price: 770,
                reduction: 20
            }, 
            fritid120: {
                price: 830,
                reduction: 22
            }, 
            skolht: {
                price: 810,
                reduction: 18
            }, 
            fritidht: {
                price: 900,
                reduction: 19
            }, 
            skolvt: {
                price: 1020,
                reduction: 19
            }, 
            fritidvt: {
                price: 1060,
                reduction: 20
            }, 
            skolulht: {
                price: 2360,
                reduction: 61
            }, 
            fritidulht: {
                price: 1500,
                reduction: 34
            }, 
            skolulvt: {
                price: 3030,
                reduction: 64
            }, 
            fritidulvt: {
                price: 1750,
                reduction: 35
            }, 
            arlanda30: {
                price: 1430,
                reduction: 95
            }, 
            ul30: {
                price: 1930,
                reduction: 127
            }
        },
        reduced: {
            d30: {
                price: 650,
                reduction: 43
            },
            d90: {
                price: 1880,
                reduction: 55
            },
            y1: {
                price: 6830,
                reduction: 75
            },
            skol90: {
                price: 630,
                reduction: 22
            }, 
            fritid90: {
                price: 770,
                reduction: 27
            }, 
            skol120: {
                price: 770,
                reduction: 20
            }, 
            fritid120: {
                price: 830,
                reduction: 22
            }, 
            skolht: {
                price: 810,
                reduction: 18
            }, 
            fritidht: {
                price: 900,
                reduction: 19
            }, 
            skolvt: {
                price: 1020,
                reduction: 19
            }, 
            fritidvt: {
                price: 1060,
                reduction: 20
            }, 
            skolulht: {
                price: 2360,
                reduction: 61
            }, 
            fritidulht: {
                price: 1500,
                reduction: 34
            }, 
            skolulvt: {
                price: 3030,
                reduction: 64
            }, 
            fritidulvt: {
                price: 1750,
                reduction: 35
            }, 
            arlanda30: {
                price: 1060,
                reduction: 71
            },
            ul30: {
                price: 1290,
                reduction: 81
            }
        }
    }
  }
  
  elements.buttons.submit.addEventListener("click", getPrice);
  
  function getPrice() {
    const fromDateInput = elements.inputs.fromDate;
    const toDateInput = elements.inputs.toDate;
    const yearInput = elements.inputs.year;
    const priceInput = elements.inputs.price;
    const ticketInput = elements.inputs.ticket;
    let fromDate, toDate, diffDays, price, reduction, totalReduction, refund;
  
    fromDate = new Date(fromDateInput.value);
    toDate = new Date(toDateInput.value);
    diffDays = Math.round((toDate.getTime()-fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
  
  
    price = priceMatrix[yearInput.value][priceInput.value][ticketInput.value].price;
    reduction = priceMatrix[yearInput.value][priceInput.value][ticketInput.value].reduction;
    totalReduction = diffDays*reduction;
    refund = price - totalReduction;
    if(refund<=0){refund = 0}
  
    elements.locations.result.innerHTML = `<p>${fromDate.toISOString().substring(0, 10)} - ${toDate.toISOString().substring(0, 10)} = ${diffDays} dagar</p>
        <p>${diffDays} * ${reduction} = ${totalReduction}kr</p>
        <p>${price} - ${totalReduction} = ${refund}kr</p>`;
  }
  