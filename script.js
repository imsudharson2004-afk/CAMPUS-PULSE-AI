/* =========================================================
   ENERSIGHT AI
   CAMPUS ENERGY INTELLIGENCE
========================================================= */


/* =========================================================
   CAMPUS DATA
========================================================= */

const buildings = [

    {
        name: "Block A",
        type: "Academic Block",
        occupancy: 120,
        power: 342,
        expected: 380,
        deviation: -10,
        status: "good",
        icon: "fa-building-columns"
    },

    {
        name: "Block B",
        type: "Academic Block",
        occupancy: 180,
        power: 466,
        expected: 430,
        deviation: 8,
        status: "warning",
        icon: "fa-building"
    },

    {
        name: "Block C",
        type: "Engineering Block",
        occupancy: 250,
        power: 418,
        expected: 340,
        deviation: 23,
        status: "danger",
        icon: "fa-microchip"
    },

    {
        name: "Block D",
        type: "Administration",
        occupancy: 150,
        power: 196,
        expected: 210,
        deviation: -7,
        status: "good",
        icon: "fa-landmark"
    },

    {
        name: "Block E",
        type: "Science & Labs",
        occupancy: 220,
        power: 375,
        expected: 390,
        deviation: -4,
        status: "good",
        icon: "fa-flask"
    },

    {
        name: "Central Library",
        type: "Library",
        occupancy: 310,
        power: 286,
        expected: 270,
        deviation: 6,
        status: "warning",
        icon: "fa-book-open"
    },

    {
        name: "Workshop",
        type: "Practical Workshop",
        occupancy: 80,
        power: 310,
        expected: 220,
        deviation: 41,
        status: "danger",
        icon: "fa-screwdriver-wrench"
    },

    {
        name: "Auditorium",
        type: "Event Arena",
        occupancy: 850,
        power: 120,
        expected: 100,
        deviation: 20,
        status: "warning",
        icon: "fa-microphone"
    },

    {
        name: "Sports Ground",
        type: "Outdoor Area",
        occupancy: 1200,
        power: 82,
        expected: 60,
        deviation: 37,
        status: "warning",
        icon: "fa-futbol"
    }

];


/* =========================================================
   SCENARIOS
========================================================= */

const scenarios = {

    normal: {

        name: "Normal Day",

        live: 1284,

        expected: 1390,

        waste: 126,

        peak: 1590,

        energy: 18.7,

        saving: "₹28.6K",

        risk: 28,

        riskTitle: "Low to Moderate",

        riskText:
            "Campus consumption is generally within expected limits, but several zones require attention.",

        anomalies: 4

    },


    event: {

        name: "Event Day",

        live: 1872,

        expected: 1790,

        waste: 254,

        peak: 2020,

        energy: 26.8,

        saving: "₹19.2K",

        risk: 61,

        riskTitle: "Elevated",

        riskText:
            "Auditorium cooling, lighting and visitor occupancy are driving demand above the normal academic profile.",

        anomalies: 6

    },


    sports: {

        name: "Sports Day",

        live: 2210,

        expected: 1980,

        waste: 390,

        peak: 2480,

        energy: 31.4,

        saving: "₹15.7K",

        risk: 76,

        riskTitle: "High",

        riskText:
            "Temporary outdoor loads and field lighting create a substantial peak-demand deviation.",

        anomalies: 8

    }

};


let currentScenario = "normal";


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);


const $$ = selector =>
    document.querySelectorAll(selector);


/* =========================================================
   TOAST
========================================================= */

function showToast(title, message) {

    $("#toastTitle").textContent = title;

    $("#toastMessage").textContent = message;

    $("#toast").classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        $("#toast").classList.remove("show");

    }, 3200);

}


/* =========================================================
   BUILDING CARDS
========================================================= */

function renderBuildings() {

    const grid = $("#buildingGrid");

    grid.innerHTML = "";

    buildings.forEach(building => {

        const statusText = {

            good: "OPTIMAL",

            warning: "WATCH",

            danger: "HIGH"

        }[building.status];


        const deviationSymbol =
            building.deviation > 0
                ? "↑"
                : "↓";


        const deviationClass =
            building.deviation > 15
                ? "danger"
                : building.deviation > 0
                    ? "warning"
                    : "good";


        const percentage = Math.min(
            100,
            Math.max(
                20,
                (building.power / 500) * 100
            )
        );


        const card = document.createElement("div");

        card.className = "building-card";


        card.innerHTML = `

            <div class="building-top">

                <div class="building-symbol">

                    <i class="fa-solid ${building.icon}"></i>

                </div>

                <span class="building-status ${building.status}">
                    ${statusText}
                </span>

            </div>


            <h3>
                ${building.name}
            </h3>


            <div class="occupancy">

                <i class="fa-solid fa-users"></i>

                ${building.occupancy} occupants

                ·

                ${building.type}

            </div>


            <div class="building-power">

                <strong>
                    ${building.power}
                </strong>

                <span>kW</span>

            </div>


            <div class="deviation ${deviationClass}">

                ${deviationSymbol}

                ${Math.abs(building.deviation)}%

                vs historical baseline

            </div>


            <div class="building-bar ${building.status}">

                <span style="width:${percentage}%"></span>

            </div>

        `;


        card.addEventListener("click", () => {

            showToast(

                building.name,

                `${building.power} kW live · ${Math.abs(building.deviation)}% ${building.deviation > 0 ? "above" : "below"} baseline`

            );

        });


        grid.appendChild(card);

    });

}


/* =========================================================
   CHART DATA
========================================================= */

const hours = [
    "00",
    "02",
    "04",
    "06",
    "08",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22"
];


const normalActual = [
    520,
    480,
    450,
    500,
    720,
    940,
    1190,
    1510,
    1480,
    1280,
    970,
    690
];


const normalExpected = [
    500,
    470,
    460,
    510,
    700,
    920,
    1160,
    1450,
    1460,
    1260,
    950,
    670
];


const eventActual = [
    530,
    490,
    470,
    520,
    760,
    1030,
    1390,
    1880,
    2020,
    1870,
    1410,
    850
];


const eventExpected = [
    500,
    470,
    460,
    510,
    700,
    950,
    1280,
    1750,
    1790,
    1660,
    1300,
    760
];


const sportsActual = [
    500,
    470,
    450,
    510,
    700,
    950,
    1300,
    1750,
    2300,
    2480,
    2210,
    1320
];


const sportsExpected = [
    500,
    470,
    450,
    510,
    690,
    900,
    1180,
    1500,
    1850,
    1980,
    1800,
    1100
];


/* =========================================================
   LIVE CHART
========================================================= */

let liveChart;


function createLiveChart() {

    const ctx =
        $("#liveChart").getContext("2d");


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            320
        );


    gradient.addColorStop(
        0,
        "rgba(50,214,160,.22)"
    );


    gradient.addColorStop(
        1,
        "rgba(50,214,160,0)"
    );


    liveChart = new Chart(
        ctx,
        {

            type: "line",

            data: {

                labels: hours,

                datasets: [

                    {

                        label: "Actual",

                        data: normalActual,

                        borderColor: "#32d6a0",

                        backgroundColor: gradient,

                        fill: true,

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: .42

                    },

                    {

                        label: "Historical Expected",

                        data: normalExpected,

                        borderColor: "#53758d",

                        borderDash: [5,5],

                        borderWidth: 1.5,

                        pointRadius: 0,

                        fill: false,

                        tension: .42

                    }

                ]

            },


            options: chartOptions()

        }

    );

}


/* =========================================================
   DEMAND CHART
========================================================= */

let demandChart;


function createDemandChart() {

    const ctx =
        $("#demandChart").getContext("2d");


    demandChart = new Chart(
        ctx,
        {

            type: "line",

            data: {

                labels: hours,

                datasets: [

                    {

                        label: "Demand",

                        data: normalActual,

                        borderColor: "#4aaef0",

                        borderWidth: 2,

                        pointRadius: 0,

                        tension: .42,

                        fill: false

                    },

                    {

                        label: "Expected",

                        data: normalExpected,

                        borderColor: "#526d82",

                        borderDash: [5,5],

                        borderWidth: 1,

                        pointRadius: 0,

                        tension: .42,

                        fill: false

                    }

                ]

            },


            options: chartOptions()

        }

    );

}


/* =========================================================
   CHART OPTIONS
========================================================= */

function chartOptions() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {

            intersect: false,

            mode: "index"

        },


        plugins: {

            legend: {

                display: false

            },


            tooltip: {

                backgroundColor: "#0b1d2e",

                borderColor: "#27465d",

                borderWidth: 1,

                padding: 10,

                titleFont: {

                    size: 9

                },

                bodyFont: {

                    size: 8

                },

                displayColors: false

            }

        },


        scales: {

            x: {

                grid: {

                    display: false

                },

                ticks: {

                    color: "#5c7388",

                    font: {

                        size: 8

                    }

                }

            },


            y: {

                beginAtZero: false,

                grid: {

                    color:
                        "rgba(70,100,120,.14)"

                },

                border: {

                    display: false

                },

                ticks: {

                    color: "#5c7388",

                    font: {

                        size: 8

                    },

                    callback: value =>
                        value + " kW"

                }

            }

        }

    };

}


/* =========================================================
   UPDATE SCENARIO
========================================================= */

function updateScenario(scenarioName) {

    currentScenario = scenarioName;

    const data =
        scenarios[scenarioName];


    /* -------------------------
       KPI
    ------------------------- */

    $("#livePower").textContent =
        data.live.toLocaleString();


    $("#heroPower").textContent =
        data.live.toLocaleString();


    $("#expectedDemand").textContent =
        data.expected.toLocaleString();


    $("#wastePower").textContent =
        data.waste.toLocaleString();


    $("#monthlySaving").textContent =
        data.saving;


    $("#peakDemand").textContent =
        data.peak.toLocaleString() + " kW";


    $("#compareActual").textContent =
        data.live.toLocaleString() + " kW";


    $("#compareWaste").textContent =
        data.waste.toLocaleString() + " kW";


    $("#anomalyCount").textContent =
        data.anomalies;


    /* -------------------------
       RISK
    ------------------------- */

    $("#riskScore").textContent =
        data.risk;


    $("#riskTitle").textContent =
        data.riskTitle;


    $("#riskDescription").textContent =
        data.riskText;


    /* -------------------------
       BAR CALCULATIONS
    ------------------------- */

    const actualPercent =
        Math.min(
            95,
            (data.live / 2200) * 100
        );


    const wastePercent =
        Math.min(
            90,
            (data.waste / data.live) * 100 * 2
        );


    $("#actualBar").style.width =
        actualPercent + "%";


    $("#wasteCompareBar").style.width =
        wastePercent + "%";


    $("#wasteBar").style.width =
        Math.min(
            100,
            (data.waste / data.live) * 100 * 3
        ) + "%";


    /* -------------------------
       CHARTS
    ------------------------- */

    let actual;
    let expected;


    if (scenarioName === "normal") {

        actual = normalActual;
        expected = normalExpected;

    }


    if (scenarioName === "event") {

        actual = eventActual;
        expected = eventExpected;

    }


    if (scenarioName === "sports") {

        actual = sportsActual;
        expected = sportsExpected;

    }


    liveChart.data.datasets[0].data =
        actual;


    liveChart.data.datasets[1].data =
        expected;


    liveChart.update();


    demandChart.data.datasets[0].data =
        actual;


    demandChart.data.datasets[1].data =
        expected;


    demandChart.update();


    /* -------------------------
       SCENARIO BUTTON
    ------------------------- */

    $$(".scenario").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.scenario === scenarioName
        );

    });


    showToast(

        data.name + " loaded",

        "Historical baseline and live demand profile updated."

    );

}


/* =========================================================
   SCENARIO BUTTONS
========================================================= */

$$(".scenario").forEach(button => {

    button.addEventListener(
        "click",
        () => {

            updateScenario(
                button.dataset.scenario
            );

        }
    );

});


/* =========================================================
   EVENT SIMULATION BUTTONS
========================================================= */

$$(".event-button").forEach(button => {

    button.addEventListener(
        "click",
        () => {

            updateScenario(
                button.dataset.scenario
            );


            document
                .querySelector("#dashboard")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

});


/* =========================================================
   AI ANALYSIS
========================================================= */

$("#analysisButton").addEventListener(
    "click",
    () => {

        $("#aiModal").classList.add("open");

    }
);


/* =========================================================
   CLOSE MODAL
========================================================= */

$("#modalClose").addEventListener(
    "click",
    () => {

        $("#aiModal").classList.remove("open");

    }
);


/* =========================================================
   MODAL CONTINUE
========================================================= */

$("#modalContinue").addEventListener(
    "click",
    () => {

        $("#aiModal").classList.remove("open");

        document
            .querySelector("#recommendations")
            .scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            "AI Recommendations Ready",
            "Energy-saving actions have been generated."
        );

    }
);


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

$("#aiModal").addEventListener(
    "click",
    event => {

        if (
            event.target ===
            $("#aiModal")
        ) {

            $("#aiModal")
                .classList.remove("open");

        }

    }
);


/* =========================================================
   REFRESH LIVE DATA
========================================================= */

$("#refreshButton").addEventListener(
    "click",
    () => {

        const variation =
            Math.floor(
                Math.random() * 80
            ) - 40;


        const data =
            scenarios[currentScenario];


        const updated =
            Math.max(
                300,
                data.live + variation
            );


        $("#livePower").textContent =
            updated.toLocaleString();


        $("#heroPower").textContent =
            updated.toLocaleString();


        $("#lastUpdated").textContent =
            "just now";


        showToast(
            "Live telemetry refreshed",
            `Current campus load: ${updated.toLocaleString()} kW`
        );

    }
);


/* =========================================================
   GENERATE AI ACTIONS
========================================================= */

$("#generateActions").addEventListener(
    "click",
    () => {

        const button =
            $("#generateActions");


        button.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i>
             Analyzing...`;


        setTimeout(() => {

            button.innerHTML =
                `<i class="fa-solid fa-check"></i>
                 Actions Generated`;


            showToast(
                "AI analysis complete",
                "4 energy-saving opportunities identified."
            );


        }, 1500);

    }
);


/* =========================================================
   REPORT
========================================================= */

$("#reportButton").addEventListener(
    "click",
    () => {

        showToast(
            "Report generated",
            "Campus energy intelligence report is ready."
        );

    }
);


/* =========================================================
   NOTIFICATION
========================================================= */

$("#notificationButton").addEventListener(
    "click",
    () => {

        document
            .querySelector("#anomalies")
            .scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            "4 active abnormalities",
            "Opening AI anomaly detection."
        );

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

$$(".nav-link").forEach(link => {

    link.addEventListener(
        "click",
        () => {

            $$(".nav-link").forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            link.classList.add("active");


            if (
                window.innerWidth < 800
            ) {

                $("#sidebar")
                    .classList.remove(
                        "open"
                    );

            }

        }
    );

});


/* =========================================================
   MOBILE MENU
========================================================= */

$("#mobileMenu").addEventListener(
    "click",
    () => {

        $("#sidebar")
            .classList.toggle("open");

    }
);


/* =========================================================
   REVIEW BUTTONS
========================================================= */

$$(".review-button").forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showToast(
                "Recommendation selected",
                "AI explanation and projected savings opened."
            );

        }
    );

});


/* =========================================================
   TIME FILTER
========================================================= */

$$(".time-selector button").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                $$(".time-selector button")
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                showToast(
                    "Time range changed",
                    `${button.textContent} demand profile selected.`
                );

            }
        );

    }
);


/* =========================================================
   AUTO LIVE TELEMETRY
========================================================= */

setInterval(() => {

    const element =
        $("#livePower");


    if (!element) return;


    const current =
        parseInt(
            element.textContent
                .replace(/,/g,"")
        );


    const change =
        Math.floor(
            Math.random() * 21
        ) - 10;


    const next =
        Math.max(
            300,
            current + change
        );


    element.textContent =
        next.toLocaleString();


    $("#heroPower").textContent =
        next.toLocaleString();


    $("#lastUpdated").textContent =
        "a few seconds ago";


}, 5000);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderBuildings();

        createLiveChart();

        createDemandChart();

    }
);