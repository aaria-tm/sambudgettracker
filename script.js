// ================================
// SPLITQUEST BUDGET TRACKER
// ================================


// ---------- DATA ----------

let friends = JSON.parse(localStorage.getItem("sq_friends")) || [];
let transactions = JSON.parse(localStorage.getItem("sq_transactions")) || [];

let profile = JSON.parse(localStorage.getItem("sq_profile")) || {
    name: "Your Wallet",
    avatar: "🧑‍🚀"
};

let transactionType = "spent";
let selectedFriendAvatar = "👨";


// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("transactionDate").value =
        new Date().toISOString().split("T")[0];

    loadProfile();
    renderEverything();

});


// ---------- SAVE DATA ----------

function saveData() {

    localStorage.setItem("sq_friends", JSON.stringify(friends));

    localStorage.setItem(
        "sq_transactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem(
        "sq_profile",
        JSON.stringify(profile)
    );
}


// ---------- NAVIGATION ----------

function showSection(sectionId, button = null) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active-section");
    });

    document.getElementById(sectionId).classList.add("active-section");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {

        document.querySelectorAll(".nav-btn").forEach(btn => {

            if (
                btn.getAttribute("onclick") &&
                btn.getAttribute("onclick").includes(sectionId)
            ) {
                btn.classList.add("active");
            }

        });

    }

    const titles = {
        dashboard: "Dashboard",
        friends: "Friends",
        transactions: "Transactions",
        profile: "My Profile"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionId];

    renderEverything();
}


// ---------- FRIENDS ----------

function openFriendModal() {

    document.getElementById("friendModal")
        .classList.add("show");

    document.getElementById("friendName").value = "";

}


function closeFriendModal() {

    document.getElementById("friendModal")
        .classList.remove("show");

}


function selectFriendAvatar(avatar) {

    selectedFriendAvatar = avatar;

}


function addFriend() {

    const name =
        document.getElementById("friendName")
            .value.trim();

    if (!name) {

        showToast("Enter your friend's name");

        return;
    }

    const friend = {

        id: Date.now(),

        name: name,

        avatar: selectedFriendAvatar

    };

    friends.push(friend);

    saveData();

    closeFriendModal();

    renderEverything();

    showToast(`${name} added to your crew!`);

}


// ---------- DELETE FRIEND ----------

function deleteFriend(id) {

    const friend = friends.find(f => f.id === id);

    if (!friend) return;

    const confirmDelete =
        confirm(
            `Delete ${friend.name}? Their transaction history will also be removed.`
        );

    if (!confirmDelete) return;

    friends = friends.filter(f => f.id !== id);

    transactions =
        transactions.filter(t => t.friendId !== id);

    saveData();

    renderEverything();

    showToast("Friend removed");

}


// ---------- TRANSACTIONS ----------

function openTransactionModal() {

    if (friends.length === 0) {

        showToast("Add a friend first");

        openFriendModal();

        return;
    }

    populateFriendSelect();

    document.getElementById("transactionModal")
        .classList.add("show");

    document.getElementById("transactionDate").value =
        new Date().toISOString().split("T")[0];

}


function closeTransactionModal() {

    document.getElementById("transactionModal")
        .classList.remove("show");

}


function setTransactionType(type) {

    transactionType = type;

    document.getElementById("spentBtn")
        .classList.toggle(
            "active",
            type === "spent"
        );

    document.getElementById("receivedBtn")
        .classList.toggle(
            "active",
            type === "received"
        );

}


// ---------- ADD TRANSACTION ----------

function addTransaction() {

    const friendId =
        Number(
            document.getElementById("transactionFriend").value
        );

    const amount =
        Number(
            document.getElementById("transactionAmount").value
        );

    const date =
        document.getElementById("transactionDate").value;

    const note =
        document.getElementById("transactionNote")
            .value.trim();

    if (!friendId) {

        showToast("Select a friend");

        return;
    }

    if (!amount || amount <= 0) {

        showToast("Enter a valid amount");

        return;
    }

    if (!date) {

        showToast("Select a date");

        return;
    }

    const transaction = {

        id: Date.now(),

        friendId: friendId,

        amount: amount,

        type: transactionType,

        date: date,

        note: note || (
            transactionType === "spent"
                ? "Money spent"
                : "Payment received"
        )

    };

    transactions.unshift(transaction);

    saveData();

    document.getElementById("transactionAmount").value = "";

    document.getElementById("transactionNote").value = "";

    closeTransactionModal();

    renderEverything();

    showToast(
        transactionType === "spent"
            ? `₹${amount} added to your balance`
            : `₹${amount} payment recorded`
    );

}


// ---------- DELETE TRANSACTION ----------

function deleteTransaction(id) {

    transactions =
        transactions.filter(t => t.id !== id);

    saveData();

    renderEverything();

    showToast("Transaction deleted");

}


// ---------- CALCULATE BALANCE ----------

/*

    spent:
        YOU paid money
        FRIEND owes YOU

    received:
        FRIEND paid money
        balance decreases

    Example:

    You spend ₹100
    Balance = +100

    Friend gives ₹50
    Balance = +100 - 50 = ₹50

    Friend gives ₹50 again
    Balance = 100 - 50 - 50 = ₹0

*/

function getFriendBalance(friendId) {

    let balance = 0;

    transactions
        .filter(t => t.friendId === friendId)
        .forEach(t => {

            if (t.type === "spent") {

                balance += Number(t.amount);

            } else {

                balance -= Number(t.amount);

            }

        });

    return balance;

}


// ---------- TOTALS ----------

function getTotals() {

    let totalOwed = 0;
    let totalOwe = 0;
    let totalSpent = 0;

    friends.forEach(friend => {

        const balance =
            getFriendBalance(friend.id);

        if (balance > 0) {

            totalOwed += balance;

        } else {

            totalOwe += Math.abs(balance);

        }

    });


    transactions.forEach(t => {

        if (t.type === "spent") {

            totalSpent += Number(t.amount);

        }

    });


    return {
        totalOwed,
        totalOwe,
        totalSpent
    };

}


// ---------- DASHBOARD ----------

function renderDashboard() {

    const totals = getTotals();

    document.getElementById("totalOwed")
        .textContent =
        formatMoney(totals.totalOwed);

    document.getElementById("totalOwe")
        .textContent =
        formatMoney(totals.totalOwe);

    document.getElementById("totalSpent")
        .textContent =
        formatMoney(totals.totalSpent);

    document.getElementById("totalFriends")
        .textContent =
        friends.length;


    renderDashboardFriends();

    renderRecentTransactions();

    updateLevel();

}


// ---------- DASHBOARD FRIENDS ----------

function renderDashboardFriends() {

    const container =
        document.getElementById("dashboardFriends");

    if (friends.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No friends yet.<br>
                Add someone to start tracking.
            </div>
        `;

        return;
    }


    container.innerHTML =
        friends.slice(0, 5).map(friend => {

            const balance =
                getFriendBalance(friend.id);

            const status =
                getBalanceText(balance);

            return `

                <div class="friend-row">

                    <div class="friend-avatar">
                        ${friend.avatar}
                    </div>

                    <div class="friend-info">

                        <strong>
                            ${escapeHTML(friend.name)}
                        </strong>

                        <small>
                            ${status.text}
                        </small>

                    </div>

                    <div class="balance">

                        <strong class="${status.class}">
                            ${balance === 0
                                ? "₹0"
                                : formatMoney(Math.abs(balance))}
                        </strong>

                        <small>
                            ${balance === 0
                                ? "settled"
                                : status.label}
                        </small>

                    </div>

                </div>

            `;

        }).join("");

}


// ---------- FRIENDS PAGE ----------

function renderFriends() {

    const container =
        document.getElementById("friendsGrid");

    if (friends.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No friends added yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        friends.map(friend => {

            const balance =
                getFriendBalance(friend.id);

            const abs =
                Math.abs(balance);

            const spent =
                transactions
                    .filter(t =>
                        t.friendId === friend.id &&
                        t.type === "spent"
                    )
                    .reduce(
                        (sum, t) =>
                            sum + Number(t.amount),
                        0
                    );

            const received =
                transactions
                    .filter(t =>
                        t.friendId === friend.id &&
                        t.type === "received"
                    )
                    .reduce(
                        (sum, t) =>
                            sum + Number(t.amount),
                        0
                    );

            let percentage = 0;

            if (spent > 0) {

                percentage =
                    Math.min(
                        100,
                        Math.round(
                            (received / spent) * 100
                        )
                    );

            }


            const status =
                getBalanceText(balance);


            return `

                <div class="friend-card">

                    <div class="friend-card-top">

                        <div class="friend-card-avatar">
                            ${friend.avatar}
                        </div>

                        <button
                            class="delete-friend"
                            onclick="deleteFriend(${friend.id})"
                        >
                            ×
                        </button>

                    </div>

                    <h3>
                        ${escapeHTML(friend.name)}
                    </h3>

                    <span class="status">
                        ${status.text}
                    </span>

                    <div class="friend-balance">

                        <h2 class="${status.class}">
                            ${balance === 0
                                ? "₹0"
                                : formatMoney(abs)}
                        </h2>

                        <p>
                            ${balance === 0
                                ? "All settled"
                                : status.label}
                        </p>

                    </div>

                    <div class="progress">

                        <div
                            class="progress-fill"
                            style="width:${percentage}%"
                        ></div>

                    </div>

                </div>

            `;

        }).join("");

}


// ---------- TRANSACTION LIST ----------

function renderRecentTransactions() {

    const container =
        document.getElementById("recentTransactions");

    if (transactions.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No transactions yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        transactions
            .slice(0, 5)
            .map(t => transactionHTML(t))
            .join("");

}


function renderTransactions() {

    populateFriendFilter();

    const container =
        document.getElementById("allTransactions");

    const friendFilter =
        document.getElementById("filterFriend").value;

    const typeFilter =
        document.getElementById("filterType").value;


    let filtered =
        [...transactions];


    if (friendFilter !== "all") {

        filtered =
            filtered.filter(
                t =>
                    t.friendId === Number(friendFilter)
            );

    }


    if (typeFilter !== "all") {

        filtered =
            filtered.filter(
                t =>
                    t.type === typeFilter
            );

    }


    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No transactions found.
            </div>
        `;

        return;
    }


    container.innerHTML =
        filtered
            .map(t => fullTransactionHTML(t))
            .join("");

}


// ---------- TRANSACTION HTML ----------

function transactionHTML(t) {

    const friend =
        friends.find(f => f.id === t.friendId);

    if (!friend) return "";

    const isSpent =
        t.type === "spent";

    return `

        <div class="transaction-row">

            <div class="transaction-icon">
                ${isSpent ? "↗" : "↓"}
            </div>

            <div class="transaction-info">

                <strong>
                    ${isSpent
                        ? "You spent for "
                        : "Payment from "}
                    ${escapeHTML(friend.name)}
                </strong>

                <small>
                    ${formatDate(t.date)}
                    · ${escapeHTML(t.note)}
                </small>

            </div>

            <div class="transaction-amount
                ${isSpent ? "positive" : "negative"}">

                ${isSpent ? "+" : "-"}
                ${formatMoney(t.amount)}

            </div>

        </div>

    `;

}


function fullTransactionHTML(t) {

    const friend =
        friends.find(f => f.id === t.friendId);

    if (!friend) return "";

    const isSpent =
        t.type === "spent";

    return `

        <div class="full-transaction">

            <div class="friend-avatar">
                ${friend.avatar}
            </div>

            <div class="transaction-info">

                <strong>
                    ${isSpent
                        ? "You spent for "
                        : "Received from "}
                    ${escapeHTML(friend.name)}
                </strong>

                <small>
                    ${escapeHTML(t.note)}
                </small>

            </div>

            <div class="full-date">
                ${formatDate(t.date)}
            </div>

            <div class="transaction-amount
                ${isSpent ? "positive" : "negative"}">

                ${isSpent ? "+" : "-"}
                ${formatMoney(t.amount)}

            </div>

            <button
                class="delete-transaction"
                onclick="deleteTransaction(${t.id})"
            >
                ×
            </button>

        </div>

    `;

}


// ---------- FILTERS ----------

function populateFriendSelect() {

    const select =
        document.getElementById("transactionFriend");

    select.innerHTML =
        `<option value="">Select friend</option>` +
        friends.map(friend => `
            <option value="${friend.id}">
                ${escapeHTML(friend.name)}
            </option>
        `).join("");

}


function populateFriendFilter() {

    const select =
        document.getElementById("filterFriend");

    const current =
        select.value || "all";

    select.innerHTML =
        `<option value="all">All Friends</option>` +
        friends.map(friend => `
            <option value="${friend.id}">
                ${escapeHTML(friend.name)}
            </option>
        `).join("");

    if (
        [...select.options]
            .some(option => option.value === current)
    ) {

        select.value = current;

    }

}


// ---------- PROFILE ----------

function loadProfile() {

    document.getElementById("profileName")
        .textContent = profile.name;

    document.getElementById("sidebarAvatar")
        .textContent = profile.avatar;

    document.getElementById("bigAvatar")
        .textContent = profile.avatar;

    document.getElementById("nameInput")
        .value = profile.name;

}


function selectAvatar(avatar) {

    profile.avatar = avatar;

    document.getElementById("bigAvatar")
        .textContent = avatar;

}


function saveProfile() {

    const name =
        document.getElementById("nameInput")
            .value.trim();

    if (name) {

        profile.name = name;

    }

    saveData();

    loadProfile();

    showToast("Profile saved!");

}


// ---------- LEVEL SYSTEM ----------

function updateLevel() {

    const activity =
        transactions.length * 10 +
        friends.length * 5;

    const level =
        Math.floor(activity / 100) + 1;

    const xp =
        activity % 100;

    document.getElementById("levelNumber")
        .textContent =
        `LVL ${level}`;

    document.getElementById("xpFill")
        .style.width =
        `${xp}%`;

    document.getElementById("xpText")
        .textContent =
        `${xp} / 100 XP`;

}


// ---------- BALANCE TEXT ----------

function getBalanceText(balance) {

    if (balance > 0) {

        return {
            text: "Friend needs to pay you",
            label: "owes you",
            class: "positive"
        };

    }

    if (balance < 0) {

        return {
            text: "You need to pay friend",
            label: "you owe",
            class: "negative"
        };

    }

    return {
        text: "Everything is settled",
        label: "settled",
        class: "neutral"
    };

}


// ---------- FORMATTING ----------

function formatMoney(amount) {

    return "₹" +
        Number(amount)
            .toLocaleString("en-IN");

}


function formatDate(date) {

    const d =
        new Date(date + "T00:00:00");

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ---------- SECURITY ----------

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ---------- TOAST ----------

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


// ---------- RENDER EVERYTHING ----------

function renderEverything() {

    loadProfile();

    renderDashboard();

    renderFriends();

    renderTransactions();

    populateFriendSelect();

}