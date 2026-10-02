// =====================================================
// NOVA SMART FULFILL
// COMPLETE JAVASCRIPT
// =====================================================


// =====================================================
// STORE DATA
// =====================================================

const stores = [

    {
        name: "Sri Lakshmi Stores",
        distance: 1.2,
        inventory: 94,
        delivery: 91,
        capacity: 90,
        time: 19
    },

    {
        name: "Fresh Mart",
        distance: 0.6,
        inventory: 63,
        delivery: 72,
        capacity: 55,
        time: 28
    },

    {
        name: "Local Basket",
        distance: 1.8,
        inventory: 82,
        delivery: 84,
        capacity: 78,
        time: 23
    }

];


let currentScenario = "normal";


// =====================================================
// SCORE
// =====================================================

function calculateScore(store) {

    const score =
        (store.inventory * 0.50) +
        (store.delivery * 0.30) +
        (store.capacity * 0.20);

    return Number(score.toFixed(1));

}


// =====================================================
// SCENARIO SIMULATOR
// =====================================================

function applyScenario(scenario) {

    currentScenario = scenario;


    if (scenario === "normal") {

        stores[0].inventory = 94;
        stores[0].delivery = 91;
        stores[0].capacity = 90;

        stores[1].inventory = 63;
        stores[1].delivery = 72;
        stores[1].capacity = 55;

        stores[2].inventory = 82;
        stores[2].delivery = 84;
        stores[2].capacity = 78;

        const status =
            document.getElementById("scenario-status");

        if (status) {
            status.innerHTML =
                "Current scenario: <strong>Normal Conditions</strong>";
        }

    }


    if (scenario === "inventoryDisruption") {

        stores[0].inventory = 55;
        stores[0].delivery = 91;
        stores[0].capacity = 90;

        stores[1].inventory = 63;
        stores[1].delivery = 72;
        stores[1].capacity = 55;

        stores[2].inventory = 82;
        stores[2].delivery = 84;
        stores[2].capacity = 78;

        const status =
            document.getElementById("scenario-status");

        if (status) {
            status.innerHTML =
                "Current scenario: <strong>Inventory Disruption at Sri Lakshmi Stores</strong>";
        }

    }


    if (scenario === "storeBusy") {

        stores[0].inventory = 94;
        stores[0].delivery = 91;
        stores[0].capacity = 45;

        stores[1].inventory = 63;
        stores[1].delivery = 72;
        stores[1].capacity = 55;

        stores[2].inventory = 82;
        stores[2].delivery = 84;
        stores[2].capacity = 78;

        const status =
            document.getElementById("scenario-status");

        if (status) {
            status.innerHTML =
                "Current scenario: <strong>Sri Lakshmi Stores is in a busy period</strong>";
        }

    }


    renderAllStores();


    const analysisResults =
        document.getElementById("analysis-results");


    if (
        analysisResults &&
        !analysisResults.innerHTML.includes("Select products")
    ) {

        const rankedStores =
            [...stores].sort(
                (a, b) =>
                    calculateScore(b) -
                    calculateScore(a)
            );

        renderStoreResults(rankedStores);

    }

}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, clickedButton = null) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {
        page.classList.remove("active-page");
    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {
        item.classList.remove("active");
    });


    if (clickedButton) {
        clickedButton.classList.add("active");
    }

}


// =====================================================
// PRODUCT SELECTION
// =====================================================

function toggleProduct(card) {

    card.classList.toggle("selected");

    updateOrderSummary();

}


// =====================================================
// ORDER SUMMARY
// =====================================================

function updateOrderSummary() {

    const selectedCards =
        document.querySelectorAll(".product-card.selected");


    const summary =
        document.getElementById("order-summary-content");


    const count =
        document.getElementById("selected-count");


    const totalContainer =
        document.getElementById("order-total");


    if (count) {
        count.textContent =
            selectedCards.length;
    }


    if (selectedCards.length === 0) {

        if (summary) {

            summary.innerHTML = `

                <div class="empty-order">

                    <div class="empty-order-icon">
                        🛒
                    </div>

                    <strong>
                        Your basket is empty
                    </strong>

                    <span>
                        Select products to begin fulfillment analysis.
                    </span>

                </div>

            `;

        }


        if (totalContainer) {
            totalContainer.style.display = "none";
        }

        return;

    }


    let total = 0;

    let html = "";


    selectedCards.forEach(card => {

        const product =
            card.dataset.product;

        const price =
            Number(card.dataset.price);


        total += price;


        html += `

            <div class="summary-item">

                <div>

                    <strong>
                        ${product}
                    </strong>

                    <span>
                        1 × product
                    </span>

                </div>

                <strong>
                    ₹${price}
                </strong>

            </div>

        `;

    });


    summary.innerHTML = html;


    if (totalContainer) {

        totalContainer.style.display = "flex";

        totalContainer.innerHTML = `

            <span>
                Order Total
            </span>

            <strong>
                ₹${total}
            </strong>

        `;

    }

}


// =====================================================
// ANALYZE ORDER
// =====================================================

function analyzeOrder() {

    const selectedCards =
        document.querySelectorAll(".product-card.selected");


    const selectedProducts = [];


    selectedCards.forEach(card => {

        selectedProducts.push(
            card.dataset.product
        );

    });


    if (selectedProducts.length === 0) {

        alert("Please select at least one product.");

        return;

    }


    updateOrderSummary();

    showPage("analysis");


    const results =
        document.getElementById("analysis-results");


    results.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            <strong>
                Analyzing fulfillment conditions...
            </strong>

            <p>
                Checking inventory, delivery reliability
                and store capacity.
            </p>

        </div>

    `;


    setTimeout(() => {

        const rankedStores =
            [...stores].sort(
                (a, b) =>
                    calculateScore(b) -
                    calculateScore(a)
            );


        renderStoreResults(rankedStores);

    }, 900);

}


// =====================================================
// FULFILLMENT ANALYSIS RESULTS
// =====================================================

function renderStoreResults(rankedStores) {

    const container =
        document.getElementById("analysis-results");


    if (!container) {
        return;
    }


    let html = `

        <div class="results-header">

            <div>

                <h2>
                    Candidate Stores
                </h2>

                <p>
                    Ranked by predicted fulfillment reliability.
                </p>

            </div>

        </div>

    `;


    rankedStores.forEach((store, index) => {

        const score =
            calculateScore(store);


        const isRecommended =
            index === 0;


        html += `

            <div class="
                store-result-card
                ${isRecommended ? "recommended" : ""}
            ">


                <!-- STORE HEADER -->

                <div class="store-result-top">

                    <div class="store-heading">

                        ${
                            isRecommended

                            ?

                            `
                            <div class="recommended-label">
                                RECOMMENDED STORE
                            </div>
                            `

                            :

                            ""
                        }


                        <h2>
                            ${store.name}
                        </h2>


                        <div class="store-meta">

                            <span>
                                ${store.distance} km away
                            </span>

                            <span class="meta-separator">
                                •
                            </span>

                            <span>
                                Estimated delivery
                                ${store.time} min
                            </span>

                        </div>

                    </div>


                    <!-- SCORE -->

                    <div class="score-box">

                        <div class="score-number">
                            ${score}
                        </div>

                        <div class="score-label">
                            FULFILLMENT SCORE
                        </div>

                    </div>

                </div>



                <!-- METRICS -->

                <div class="metrics-grid">


                    <div class="metric">

                        <div class="metric-label">
                            Inventory Confidence
                        </div>

                        <div class="metric-value">
                            ${store.inventory}%
                        </div>

                    </div>


                    <div class="metric">

                        <div class="metric-label">
                            Delivery Reliability
                        </div>

                        <div class="metric-value">
                            ${store.delivery}%
                        </div>

                    </div>


                    <div class="metric">

                        <div class="metric-label">
                            Operational Capacity
                        </div>

                        <div class="metric-value">
                            ${store.capacity}%
                        </div>

                    </div>


                    <div class="metric">

                        <div class="metric-label">
                            Estimated Delivery
                        </div>

                        <div class="metric-value">
                            ${store.time} min
                        </div>

                    </div>


                </div>



                ${
                    isRecommended

                    ?

                    `
                    <div class="recommendation-action">

                        <div class="recommendation-note">

                            <span class="recommendation-dot"></span>

                            Highest predicted fulfillment reliability

                        </div>


                        <button
                            class="primary-btn"
                            onclick="confirmStore('${store.name}')"
                        >

                            Route Order to This Store
                            →

                        </button>

                    </div>
                    `

                    :

                    ""

                }


            </div>

        `;

    });


    container.innerHTML = html;

}


// =====================================================
// CONFIRM STORE
// =====================================================

function confirmStore(storeName) {

    const store =
        stores.find(
            item =>
                item.name === storeName
        );


    if (!store) {
        return;
    }


    const score =
        calculateScore(store);


    const result =
        document.getElementById(
            "result-content"
        );


    result.innerHTML = `

        <div class="result-success">

            <div class="success-icon">
                ✓
            </div>


            <div>

                <div class="success-label">
                    FULFILLMENT CONFIRMED
                </div>

                <h1>
                    ${store.name}
                </h1>

                <p>
                    Smart Fulfill selected this store
                    based on current fulfillment conditions.
                </p>

            </div>

        </div>



        <div class="result-grid">


            <div class="result-card">

                <span>
                    Fulfillment Confidence
                </span>

                <strong>
                    ${score}%
                </strong>

            </div>


            <div class="result-card">

                <span>
                    Inventory Confidence
                </span>

                <strong>
                    ${store.inventory}%
                </strong>

            </div>


            <div class="result-card">

                <span>
                    Delivery Reliability
                </span>

                <strong>
                    ${store.delivery}%
                </strong>

            </div>


            <div class="result-card">

                <span>
                    Estimated Delivery
                </span>

                <strong>
                    ${store.time} min
                </strong>

            </div>


        </div>



        <div class="panel result-explanation">

            <h2>
                Why this store?
            </h2>

            <p>
                ${store.name}
                currently has the highest fulfillment score
                among available stores. The score combines
                inventory confidence, delivery reliability
                and operational capacity.
            </p>

        </div>

    `;


    showPage("result");


    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {
        item.classList.remove("active");
    });


    if (navItems[3]) {
        navItems[3].classList.add("active");
    }

}


// =====================================================
// STORE NETWORK
// =====================================================

function renderAllStores() {

    const container =
        document.getElementById("all-stores");


    if (!container) {
        return;
    }


    const rankedStores =
        [...stores].sort(
            (a, b) =>
                calculateScore(b) -
                calculateScore(a)
        );


    let html = "";


    rankedStores.forEach((store, index) => {

        const score =
            calculateScore(store);


        html += `

            <div class="store-network-card">

                <div class="store-network-main">

                    <div>

                        ${
                            index === 0

                            ?

                            `
                            <div class="recommended-label">
                                CURRENT TOP OPTION
                            </div>
                            `

                            :

                            ""
                        }

                        <h2>
                            ${store.name}
                        </h2>

                        <p>
                            ${store.distance} km away
                            · ${store.time} min estimated delivery
                        </p>

                    </div>


                    <div class="network-score">

                        <strong>
                            ${score}
                        </strong>

                        <span>
                            Fulfillment
                        </span>

                    </div>

                </div>


                <div class="network-metrics">

                    <div>

                        <span>
                            Inventory
                        </span>

                        <strong>
                            ${store.inventory}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            Delivery
                        </span>

                        <strong>
                            ${store.delivery}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            Capacity
                        </span>

                        <strong>
                            ${store.capacity}%
                        </strong>

                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML = html;

}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderAllStores();

    }
);