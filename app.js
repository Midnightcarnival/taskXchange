/*
  Basic SPA Router and Components for taskXchange
  Use this as starting point to build your app further.
*/

// Root App container
const app = document.getElementById('app');

// Simple in-memory "database" placeholders
const users = [
  { username: 'alice', password: 'pass123' },
  { username: 'bob', password: 'pass123' }
];

let loggedInUser = null;

// Simple navigation system
const routes = {
  '/': loginPage,
  '/home': homePage,
  '/be-a-buddy': beABuddyPage,
  '/be-a-buddy/grab-and-go': grabAndGoPage,
  '/ask-a-buddy': askABuddyPage,
  // Add more routes similarly...
};

function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path);
  router();
}

window.onpopstate = router;

// Router function
function router() {
  const path = window.location.pathname;
  const route = routes[path] || notFoundPage;
  route();
}

// ---- Pages ----

function loginPage() {
  if (loggedInUser) {
    navigate('/home');
    return;
  }

  app.innerHTML = `
    <header>taskXchange Login</header>
    <form id="login-form" aria-label="Login Form">
      <label for="username">Username</label>
      <input id="username" type="text" required autocomplete="username" />
      <label for="password">Password</label>
      <input id="password" type="password" required autocomplete="current-password" />
      <button type="submit">Login</button>
    </form>
  `;

  const form = document.getElementById('login-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const un = form.username.value.trim();
    const pw = form.password.value;
    const user = users.find(u => u.username === un && u.password === pw);
    if (user) {
      loggedInUser = user;
      navigate('/home');
    } else {
      alert('Invalid username or password');
    }
  });
}

function homePage() {
  if (!loggedInUser) {
    navigate('/');
    return;
  }

  app.innerHTML = `
    <header>Welcome, ${loggedInUser.username}</header>
    <nav aria-label="Main Navigation">
      <button id="be-a-buddy-btn">Be a Buddy</button>
      <button id="wall-of-shame-btn">Wall of Shame</button>
      <button id="ask-a-buddy-btn">Ask a Buddy</button>
      <button id="logout-btn" style="background-color:#d32f2f;">Logout</button>
    </nav>
    <p>Select an option to proceed.</p>
  `;

  document.getElementById('be-a-buddy-btn').onclick = () => navigate('/be-a-buddy');
  document.getElementById('ask-a-buddy-btn').onclick = () => navigate('/ask-a-buddy');
  document.getElementById('wall-of-shame-btn').onclick = wallOfShamePage;
  document.getElementById('logout-btn').onclick = () => {
    loggedInUser = null;
    navigate('/');
  };
}

function wallOfShamePage() {
  if (!loggedInUser) {
    navigate('/');
    return;
  }

  // TODO: fetch real data from API/backend
  const shameList = [
    { name: 'John Doe', reason: 'Did not pay reward for task delivery' },
    { name: 'Jane Smith', reason: 'Failed proxy attendance task' },
  ];

  app.innerHTML = `
    <header>Wall of Shame</header>
    <button id="back-btn">Back</button>
    <ul aria-label="Wall of Shame List">
      ${shameList.map(item => `<li><strong>${item.name}</strong>: ${item.reason}</li>`).join('')}
    </ul>
  `;

  document.getElementById('back-btn').onclick = () => navigate('/home');
}

function beABuddyPage() {
  if (!loggedInUser) {
    navigate('/');
    return;
  }

  app.innerHTML = `
    <header>Be a Buddy</header>
    <nav aria-label="Be a Buddy Navigation">
      <button id="grab-go-btn">Grab & Go (Delivery)</button>
      <button id="class-related-btn">Class Related Tasks</button>
      <button id="brain-buddy-btn">Brain Buddy</button>
      <button id="back-btn">Back</button>
    </nav>
  `;

  document.getElementById('grab-go-btn').onclick = () => navigate('/be-a-buddy/grab-and-go');
  // The other options would have similar routes (to be implemented)
  document.getElementById('class-related-btn').onclick = () =>
    alert('Class Related Tasks - Coming Soon');
  document.getElementById('brain-buddy-btn').onclick = () =>
    alert('Brain Buddy - Coming Soon');
  document.getElementById('back-btn').onclick = () => navigate('/home');
}

function grabAndGoPage() {
  if (!loggedInUser) {
    navigate('/');
    return;
  }

  // Placeholder for Grab & Go main page with prepaid/postpaid choice & lists
  app.innerHTML = `
    <header>Grab & Go (Delivery)</header>
    <button id="back-btn">Back</button>

    <form id="prepaid-postpaid-form" aria-label="Payment Option">
      <label>
        <input type="radio" name="paymentType" value="prepaid" checked />
        Prepaid
      </label>
      <label>
        <input type="radio" name="paymentType" value="postpaid" />
        Postpaid
      </label>
    </form>

    <section aria-label="Delivery Requests List">
      <h2>Requests from People</h2>
      <ul id="people-request-list">
        <li>Loading requests...</li>
      </ul>
    </section>

    <section aria-label="Friend Groups">
      <h2>Friend Groups</h2>
      <ul id="friend-group-list">
        <li>Loading groups...</li>
      </ul>
    </section>
  `;

  document.getElementById('back-btn').onclick = () => navigate('/be-a-buddy');

  // TODO: Replace with API call to fetch real data
  const sampleRequests = [
    {
      id: 'req1',
      requester: 'alice',
      approxCost: 12.5,
      reward: 3,
      deliveryLocation: 'Building A, Room 101'
    },
    {
      id: 'req2',
      requester: 'bob',
      approxCost: 8.0,
      reward: 2,
      deliveryLocation: 'Building B, Lobby'
    }
  ];

  const sampleGroups = [
    { id: 'grp1', name: 'School Friends' },
    { id: 'grp2', name: 'Basketball Team' }
  ];

  const peopleList = document.getElementById('people-request-list');
  peopleList.innerHTML = sampleRequests
    .map(
      task =>
        `<li data-id="${task.id}"><strong>${task.requester}</strong> - Cost: $${task.approxCost.toFixed(2)}, Reward: $${task.reward}, Delivery: ${task.deliveryLocation}</li>`
    )
    .join('');

  const groupList = document.getElementById('friend-group-list');
  groupList.innerHTML = sampleGroups
    .map(group => `<li data-id="${group.id}">${group.name}</li>`)
    .join('');

  // Accept task: on click, open temporary chat & acceptance flow (placeholders)
  peopleList.querySelectorAll('li').forEach(li => {
    li.onclick = () => {
      alert(
        `Accepted task from ${li.querySelector('strong').textContent}. Opening chat... (To be implemented)`
      );
      // TODO: Navigate to chat component/page, show phone number, upload photos, cashout rewards, reviews
    };
  });

  groupList.querySelectorAll('li').forEach(li => {
    li.onclick = () => alert(`Viewing group ${li.textContent} tasks (To be implemented)`);
  });
}

function askABuddyPage() {
  if (!loggedInUser) {
    navigate('/');
    return;
  }

  // Placeholder for Ask a Buddy page with 3 suboptions per your spec
  app.innerHTML = `
    <header>Ask a Buddy</header>
    <nav aria-label="Ask a Buddy Navigation">
      <button id="grab-go-btn">Grab & Go (Delivery)</button>
      <button id="class-related-btn">Class Related Tasks</button>
      <button id="brain-buddy-btn">Brain Buddy</button>
      <button id="back-btn">Back</button>
    </nav>
  `;

  document.getElementById('grab-go-btn').onclick = () =>
    alert('Ask a Buddy - Grab & Go - Coming Soon');
  document.getElementById('class-related-btn').onclick = () =>
    alert('Ask a Buddy - Class Related Tasks - Coming Soon');
  document.getElementById('brain-buddy-btn').onclick = () =>
    alert('Ask a Buddy - Brain Buddy - Coming Soon');
  document.getElementById('back-btn').onclick = () => navigate('/home');
}

function notFoundPage() {
  app.innerHTML = `
    <header>404 - Page Not Found</header>
    <button id="home-btn">Go Home</button>
  `;

  document.getElementById('home-btn').onclick = () => navigate('/home');
}

// Initialize app
router();