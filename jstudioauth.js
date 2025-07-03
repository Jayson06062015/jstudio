// Toggle the sidebar (profile menu)
window.toggleSidebar = function () {
  const sidebar = document.getElementById("profileSidebar");
  if (sidebar) {
    sidebar.classList.toggle("show");
  }
};

// Set up profile display (username + avatar)
window.setupProfile = function () {
  const user = localStorage.getItem("jstudioUser");
  if (!user) return;

  const usernameDisplay = document.getElementById("usernameDisplay");
  const avatar = document.getElementById("avatar");

  if (usernameDisplay && avatar) {
    usernameDisplay.textContent = user;
    avatar.textContent = user.charAt(0).toUpperCase();

    const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#F9C74F", "#9D4EDD"];
    avatar.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  }

  loadThemeSettings();
};

// Logout handler
window.logout = function () {
  localStorage.removeItem("jstudioUser");
  localStorage.removeItem("jstudioToken");
  window.location.href = "jstudiowelcome.html"; // Or wherever your welcome page is
};

// Apply theme based on user preferences
window.applyTheme = function (hue, sat, mode) {
  const lightness = mode === "dark" ? "20%" : "90%";
  const textColor = mode === "dark" ? "#ffffff" : "#000000";

  document.documentElement.style.setProperty("--theme-hue", hue);
  document.documentElement.style.setProperty("--theme-sat", `${sat}%`);
  document.documentElement.style.setProperty("--theme-lightness", lightness);
  document.documentElement.style.setProperty("--text-color", textColor);

  // Save to localStorage
  localStorage.setItem("themeHue", hue);
  localStorage.setItem("themeSat", sat);
  localStorage.setItem("themeMode", mode);
};

// Load and apply theme from localStorage
window.loadThemeSettings = function () {
  const hue = localStorage.getItem("themeHue") || 240;
  const sat = localStorage.getItem("themeSat") || 60;
  const mode = localStorage.getItem("themeMode") || "dark";
  applyTheme(hue, sat, mode);

  const hueSlider = document.getElementById("hueSlider");
  const satSlider = document.getElementById("satSlider");
  const modeToggle = document.getElementById("modeToggle");

  if (hueSlider) hueSlider.value = hue;
  if (satSlider) satSlider.value = sat;
  if (modeToggle) modeToggle.value = mode;
};

// Basic login logic (can be replaced with real API)
window.loginUser = function (event) {
  event.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Dummy credentials - replace with real validation
  if (email && password) {
    localStorage.setItem("jstudioUser", email);
    localStorage.setItem("jstudioToken", "dummy-token");
    window.location.href = "jstudiohome.html";
  } else {
    document.getElementById("errorMessage").textContent = "Invalid credentials.";
  }
};

// Basic register logic (can be replaced with real API)
window.registerUser = function (event) {
  event.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (email && password) {
    localStorage.setItem("jstudioUser", email);
    localStorage.setItem("jstudioToken", "dummy-token");
    window.location.href = "jstudiohome.html";
  } else {
    document.getElementById("registerError").textContent = "Please fill in all fields.";
  }
};

// Initialize on jstudiohome.html
if (window.location.pathname.includes("jstudiohome.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    setupProfile();

    const hueSlider = document.getElementById("hueSlider");
    const satSlider = document.getElementById("satSlider");
    const modeToggle = document.getElementById("modeToggle");

    if (hueSlider && satSlider && modeToggle) {
      function updateTheme() {
        applyTheme(hueSlider.value, satSlider.value, modeToggle.value);
      }

      hueSlider.addEventListener("input", updateTheme);
      satSlider.addEventListener("input", updateTheme);
      modeToggle.addEventListener("change", updateTheme);

      updateTheme();
    }
  });
}
